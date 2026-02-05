import React, { useEffect, useMemo, useRef, useState } from 'react'
import FriendList from '../components/FriendList'
import ChatPanel from '../components/ChatPanel'
import { listChatUsers, fetchMessages, postMessage } from '../api/chatApi'
import { useAuth } from '../context/AuthContext'
import { getWebSocketUrl } from '../utils/socket'

function ChatPage() {
  const { user, token } = useAuth()
  const [friends, setFriends] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [messagesByUser, setMessagesByUser] = useState({})
  const [unreadByUser, setUnreadByUser] = useState({})
  const [statusByUser, setStatusByUser] = useState({})
  const [typingByUser, setTypingByUser] = useState({})
  const [draft, setDraft] = useState('')
  const [mediaPreview, setMediaPreview] = useState(null)
  const [mediaPayload, setMediaPayload] = useState(null)
  const [sending, setSending] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const socketRef = useRef(null)
  const selectedIdRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    let active = true

    listChatUsers()
      .then((data) => {
        if (!active) return
        setFriends(data || [])
        if (data?.length) {
          setSelectedId(data[0]._id)
        }
      })
      .catch(() => {
        if (active) {
          setFriends([])
        }
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!selectedId) return
    selectedIdRef.current = selectedId
    let active = true
    setLoadingMessages(true)

    fetchMessages(selectedId)
      .then((messages) => {
        if (!active) return
        const sorted = (messages || []).slice().sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt)
        })
        setMessagesByUser((prev) => ({ ...prev, [selectedId]: sorted }))
        setUnreadByUser((prev) => ({ ...prev, [selectedId]: 0 }))
      })
      .finally(() => {
        if (active) {
          setLoadingMessages(false)
        }
      })

    return () => {
      active = false
    }
  }, [selectedId])

  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  useEffect(() => {
    if (!user) return
    const socket = new WebSocket(getWebSocketUrl(token))
    socketRef.current = socket

    const handleMessage = (event) => {
      let payload
      try {
        payload = JSON.parse(event.data)
      } catch {
        return
      }

      if (payload?.event === 'presence:list') {
        const onlineIds = payload.payload || []
        const nextStatus = {}
        onlineIds.forEach((id) => {
          nextStatus[id] = 'online'
        })
        setStatusByUser(nextStatus)
        return
      }

      if (payload?.event === 'presence') {
        const { userId, status } = payload.payload || {}
        if (!userId || !status) return
        setStatusByUser((prev) => ({ ...prev, [userId]: status }))
        return
      }

      if (payload?.event === 'typing') {
        const { userId, isTyping } = payload.payload || {}
        if (!userId || userId === user._id) return
        setTypingByUser((prev) => ({ ...prev, [userId]: Boolean(isTyping) }))
        return
      }

      if (payload?.event === 'connected') {
        const activeId = selectedIdRef.current
        if (activeId) {
          socket.send(JSON.stringify({ type: 'join', peerId: activeId }))
        }
        return
      }

      if (payload?.event === 'newMessage') {
        const message = payload.payload
        if (!message) return

        const isMine = message.senderId === user._id
        const peerId = isMine ? message.receiverId : message.senderId

        setMessagesByUser((prev) => {
          const list = prev[peerId] || []
          const hasMessage = list.some((item) => item._id === message._id)
          if (hasMessage) {
            return prev
          }
          const filtered = list.filter((item) => {
            const isTemp = String(item._id).startsWith('temp-')
            return !(
              isTemp &&
              item.senderId === message.senderId &&
              item.receiverId === message.receiverId &&
              item.text === message.text
            )
          })
          return { ...prev, [peerId]: [...filtered, message] }
        })

        if (!isMine && peerId !== selectedIdRef.current) {
          setUnreadByUser((prev) => ({
            ...prev,
            [peerId]: (prev[peerId] || 0) + 1,
          }))
        }
      }
    }

    socket.addEventListener('message', handleMessage)

    return () => {
      socket.removeEventListener('message', handleMessage)
      socket.close()
    }
  }, [user, token, selectedId])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket || !selectedId) return

    const joinPayload = JSON.stringify({ type: 'join', peerId: selectedId })
    const stopTypingPayload = JSON.stringify({
      type: 'stopTyping',
      peerId: selectedId,
    })

    const sendJoin = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(joinPayload)
      }
    }

    if (socket.readyState === WebSocket.OPEN) {
      sendJoin()
    } else {
      socket.addEventListener('open', sendJoin)
    }

    return () => {
      socket.removeEventListener('open', sendJoin)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'leave', peerId: selectedId }))
        socket.send(stopTypingPayload)
      }
    }
  }, [selectedId])

  const sendTyping = (isTyping) => {
    const socket = socketRef.current
    if (!socket || socket.readyState !== WebSocket.OPEN || !selectedIdRef.current) {
      return
    }
    socket.send(
      JSON.stringify({
        type: isTyping ? 'typing' : 'stopTyping',
        peerId: selectedIdRef.current,
      })
    )
  }

  const handleDraftChange = (value) => {
    setDraft(value)

    if (!selectedIdRef.current) {
      return
    }

    if (!value.trim()) {
      sendTyping(false)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      return
    }

    sendTyping(true)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false)
    }, 1200)
  }

  const handleSend = async () => {
    const text = draft.trim()
    if ((!text && !mediaPayload) || !selectedId || !user) {
      return
    }

    const payloadImage = mediaPayload
    const tempId = `temp-${Date.now()}`
    const optimistic = {
      _id: tempId,
      senderId: user._id,
      receiverId: selectedId,
      text,
      image: mediaPreview || payloadImage,
      createdAt: new Date().toISOString(),
    }

    setMessagesByUser((prev) => {
      const list = prev[selectedId] || []
      return { ...prev, [selectedId]: [...list, optimistic] }
    })
    setDraft('')
    setMediaPreview(null)
    setMediaPayload(null)
    setSending(true)

    try {
      const saved = await postMessage(selectedId, {
        text: text || undefined,
        image: payloadImage || undefined,
      })
      setMessagesByUser((prev) => {
        const list = (prev[selectedId] || []).filter((item) => item._id !== tempId)
        if (list.some((item) => item._id === saved._id)) {
          return { ...prev, [selectedId]: list }
        }
        return { ...prev, [selectedId]: [...list, saved] }
      })
    } catch {
      setMessagesByUser((prev) => {
        const list = (prev[selectedId] || []).filter(
          (item) => item._id !== tempId
        )
        return { ...prev, [selectedId]: list }
      })
    } finally {
      setSending(false)
    }
  }

  const friendsView = useMemo(() => {
    return friends.map((friend) => {
      const lastMessage = messagesByUser[friend._id]?.slice(-1)[0]
      return {
        ...friend,
        name: friend.username,
        role: friend.email,
        status: statusByUser[friend._id] || 'offline',
        lastMessage: lastMessage?.text,
        unread: unreadByUser[friend._id] || 0,
      }
    })
  }, [friends, messagesByUser, unreadByUser, statusByUser])

  const filteredFriends = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return friendsView
    return friendsView.filter((friend) =>
      friend.name.toLowerCase().includes(query)
    )
  }, [friendsView, search])

  const selectedFriend = useMemo(
    () => friendsView.find((friend) => friend._id === selectedId),
    [friendsView, selectedId]
  )

  const messages = useMemo(() => {
    return selectedId ? messagesByUser[selectedId] || [] : []
  }, [messagesByUser, selectedId])

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-16 pt-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Chat workspace
          </p>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Conversations at a glance
          </h2>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {friends.length} teammates active
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[0.38fr_0.62fr]">
        <FriendList
          friends={filteredFriends}
          onSelect={setSelectedId}
          search={search}
          onSearch={setSearch}
          selectedId={selectedId}
        />
        <ChatPanel
          friend={selectedFriend}
          messages={messages}
          currentUserId={user?._id}
          draft={draft}
          onDraftChange={handleDraftChange}
          mediaPreview={mediaPreview}
          onSelectMedia={(payload, preview) => {
            setMediaPayload(payload)
            setMediaPreview(preview)
          }}
          onClearMedia={() => {
            setMediaPayload(null)
            setMediaPreview(null)
          }}
          onSend={handleSend}
          isSending={sending}
          isLoading={loadingMessages}
          isTyping={Boolean(
            selectedFriend && typingByUser[selectedFriend._id]
          )}
        />
      </div>
    </section>
  )
}

export default ChatPage
