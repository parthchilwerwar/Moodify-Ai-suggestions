import { useState, FormEvent } from 'react'

interface MoodInputProps {
  onMoodSubmit: (mood: string) => void
}

const moodEmojis = [
  { emoji: '😊', mood: 'Happy' },
  { emoji: '😢', mood: 'Sad' },
  { emoji: '😎', mood: 'Cool' },
  { emoji: '😴', mood: 'Sleepy' },
  { emoji: '🥳', mood: 'Party' },
  { emoji: '😌', mood: 'Relaxed' },
  { emoji: '🤔', mood: 'Thoughtful' },
  { emoji: '😤', mood: 'Frustrated' },
]

export default function MoodInput({ onMoodSubmit }: MoodInputProps) {
  const [mood, setMood] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onMoodSubmit(mood)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center gap-2 mb-4">
          {moodEmojis.map(({ emoji, mood: emojiMood }) => (
            <button
              key={emojiMood}
              type="button"
              onClick={() => setMood(emojiMood)}
              className={`text-2xl p-2 rounded-full ${mood === emojiMood ? 'bg-purple-600' : 'bg-gray-200'}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Enter your mood"
          className="w-full p-4 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-lg transition duration-300 ease-in-out"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300"
        >
          Generate Playlist
        </button>
      </div>
    </form>
  )
}
