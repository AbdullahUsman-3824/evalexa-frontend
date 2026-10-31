export interface InterviewQuestion {
  id: string
  order: number
  questionText: string
  skill: string
  category: string
  maxDurationSeconds: number
}

export const MOCK_INTERVIEW = {
  id: 'int-1',
  pin: '482916',
  expiresAt: '2027-01-01T00:00:00Z',
  deadline: '2027-01-01T00:00:00Z',
  job: {
    title: 'Frontend Developer',
    company: 'TechCorp Inc.',
    department: 'Engineering',
    requiredSkills: ['React', 'TypeScript', 'CSS', 'Node.js'],
  },
  candidate: {
    name: 'Ayesha Khan',
    email: 'ayesha@email.com',
  },
  questions: [
    {
      id: 'q1',
      order: 1,
      questionText:
        'Describe a production issue you debugged in a React application. What was the root cause and how did you fix it?',
      skill: 'React',
      category: 'Technical',
      maxDurationSeconds: 120,
    },
    {
      id: 'q2',
      order: 2,
      questionText:
        'You are working on a project with a tight deadline and a team member is not meeting their commitments. How would you handle this?',
      skill: 'Communication',
      category: 'Behavioral',
      maxDurationSeconds: 90,
    },
    {
      id: 'q3',
      order: 3,
      questionText:
        'Explain the difference between REST and GraphQL. When would you choose one over the other in a frontend project?',
      skill: 'TypeScript',
      category: 'Conceptual',
      maxDurationSeconds: 90,
    },
    {
      id: 'q4',
      order: 4,
      questionText:
        'Walk me through how you would optimize a React application experiencing slow render times with a large data list.',
      skill: 'Performance',
      category: 'Problem Solving',
      maxDurationSeconds: 120,
    },
    {
      id: 'q5',
      order: 5,
      questionText:
        'Tell me about a time you had to learn a new technology quickly to meet a project requirement. What was your approach?',
      skill: 'Adaptability',
      category: 'Behavioral',
      maxDurationSeconds: 90,
    },
  ] as InterviewQuestion[],
}