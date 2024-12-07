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
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del jugador"
          className="flex-grow bg-white/90"
        />
        <Button 
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Añadir jugador
        </Button>
      </form>
    </div>
  )
}

