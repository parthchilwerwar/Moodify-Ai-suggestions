import { useState, FormEvent } from 'react'

interface MoodInputProps {
  onMoodSubmit: (mood: string) => void
}

export default function MoodInput({ onMoodSubmit }: MoodInputProps) {
  const [mood, setMood] = useState('')
  const [error, setError] = useState<string | null>(null) 

  const suggestedMoods = [
    "energetic and ready to party",
    "melancholy and reflective", 
    "excited about life",
    "chill and relaxed",
    "nostalgic and dreamy",
    "motivated and focused",
    "romantic and in love",
    "confident and powerful",
    "peaceful and calm",
    "adventurous and wild",
    "creative and inspired",
    "happy and uplifting",
    "sad and emotional",
    "angry and intense",
    "hopeful and optimistic",
    "mysterious and dark"
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!mood.trim()) {
      setError('Please describe your current mood.'); 
      return; 
    }

    setError(null); 
    onMoodSubmit(mood.trim()); 
  }

  const handleSuggestedMood = (suggestedMood: string) => {
    setMood(suggestedMood);
    setError(null);
  }

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-2">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <label htmlFor="mood-input" className="block text-sm sm:text-base font-medium text-theme-text text-center sm:text-left">
            How are you feeling?
          </label>
          <input
            id="mood-input"
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Describe your current mood..."
            className="w-full p-2.5 sm:p-3 md:p-4 rounded-lg bg-theme-surface border border-theme-disabled text-theme-text placeholder-theme-disabled focus:outline-none focus:ring-2 focus:ring-theme-accent focus:border-theme-accent text-sm sm:text-base transition duration-200 ease-in-out"
            autoComplete="off"
            maxLength={200}
          />
          {error && (
            <p className="text-theme-accent text-xs sm:text-sm mt-1 text-center">{error}</p>
          )}
          
          {/* Suggested Moods */}
          <div className="mt-2 sm:mt-3">
            <p className="text-xs sm:text-sm text-theme-disabled mb-1.5 sm:mb-2 text-center">Try these moods:</p>
            <div className="flex flex-wrap gap-1 sm:gap-1.5 justify-center">
              {suggestedMoods.slice(0, 8).map((suggestedMood, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestedMood(suggestedMood)}
                  className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs bg-theme-surface hover:bg-theme-accent text-theme-text rounded-full transition duration-200 hover:text-white border border-theme-disabled hover:border-theme-accent touch-friendly"
                >
                  {suggestedMood}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={!mood.trim()}
          className="w-full bg-theme-accent hover:bg-theme-accent-hover disabled:bg-theme-disabled disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg touch-friendly touch-target"
        >
          Generate Playlist
        </button>
      </form>
    </div>
  )
}


