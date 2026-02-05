export const friendsSeed = [
  {
    id: 'ava',
    name: 'Ava Chen',
    role: 'Product Designer',
    status: 'online',
    lastMessage: 'I can review the flow in 10.',
    unread: 2,
  },
  {
    id: 'miles',
    name: 'Miles Carter',
    role: 'Frontend Engineer',
    status: 'online',
    lastMessage: 'Pushing the hotfix now.',
    unread: 0,
  },
  {
    id: 'rhea',
    name: 'Rhea Kapoor',
    role: 'Community Lead',
    status: 'away',
    lastMessage: 'Let us announce the beta invite.',
    unread: 1,
  },
  {
    id: 'enzo',
    name: 'Enzo Valdez',
    role: 'Growth',
    status: 'offline',
    lastMessage: 'Draft is in the drive.',
    unread: 0,
  },
  {
    id: 'hana',
    name: 'Hana Moreno',
    role: 'QA Analyst',
    status: 'online',
    lastMessage: 'Found one more edge case.',
    unread: 3,
  },
]

export const messageSeed = {
  ava: [
    { id: 1, from: 'them', text: 'New onboarding animations look good.' },
    { id: 2, from: 'me', text: 'Nice! Want me to prep a mini demo?' },
    { id: 3, from: 'them', text: 'Yes, 3 screens is enough.' },
    { id: 4, from: 'me', text: 'On it. Will send before standup.' },
  ],
  miles: [
    { id: 1, from: 'them', text: 'Edge case on mobile is fixed.' },
    { id: 2, from: 'me', text: 'Great. I will verify in staging.' },
    { id: 3, from: 'them', text: 'Pushing the hotfix now.' },
  ],
  rhea: [
    { id: 1, from: 'them', text: 'Should we open the invite list today?' },
    { id: 2, from: 'me', text: 'Yes, let us schedule at 4 PM.' },
    { id: 3, from: 'them', text: 'Perfect, I will post the teaser.' },
  ],
  enzo: [
    { id: 1, from: 'me', text: 'Any update on the campaign brief?' },
    { id: 2, from: 'them', text: 'Draft is in the drive.' },
  ],
  hana: [
    { id: 1, from: 'them', text: 'Found one more edge case.' },
    { id: 2, from: 'me', text: 'Send me the steps and I will patch it.' },
    { id: 3, from: 'them', text: 'Will do after lunch.' },
  ],
}

export const statusTone = {
  online: 'bg-emerald-500',
  away: 'bg-amber-400',
  offline: 'bg-slate-400',
}
