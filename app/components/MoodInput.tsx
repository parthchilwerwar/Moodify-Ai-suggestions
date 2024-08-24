import { useState, FormEvent } from 'react'

interface MoodInputProps {
  onMoodSubmit: (mood: string) => void
}

export default function MoodInput({ onMoodSubmit }: MoodInputProps) {
  const [mood, setMood] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onMoodSubmit(mood)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 w-full">
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          id="mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full p-4 rounded-t-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-white transition duration-300 ease-in-out"
          placeholder="How are you feeling today?"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out"
        >
          Generate Playlist
        </button>
      </div>
    </form>
  )
}
