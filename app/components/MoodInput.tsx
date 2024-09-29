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
  const [error, setError] = useState<string | null>(null) 

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!mood) {
      setError('Please select or enter a mood.'); 
      return; 
    }

    setError(null); 
    onMoodSubmit(mood); 
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {moodEmojis.map(({ emoji, mood: emojiMood }) => (
            <button
              key={emojiMood}
              type="button"
              onClick={() => setMood(emojiMood)}
              className={`text-xl md:text-2xl p-2 rounded-full ${mood === emojiMood ? 'bg-blue-neon' : 'bg-white-neon'}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="What's your mood tonight?"
          className="w-full p-3 md:p-4 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 text-base md:text-lg transition duration-300 ease-in-out"
        />
        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-neon text-white font-bold py-2 md:py-3 px-4 rounded-lg text-base md:text-lg transition duration-300"
        >
          Generate Playlist
        </button>
      </div>
    </form>
  )
}


