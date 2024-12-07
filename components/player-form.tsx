import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PlayerFormProps {
  addPlayer: (name: string) => void
}

export function PlayerForm({ addPlayer }: PlayerFormProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      addPlayer(name.trim())
      setName('')
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del jugador"
          className="flex-grow bg-white/90 h-10 sm:h-11 text-base sm:text-lg text-center placeholder:text-center"
        />
        <Button 
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white h-10 sm:h-11 text-base sm:text-lg whitespace-nowrap"
        >
          Añadir
        </Button>
      </form>
    </div>
  )
}

