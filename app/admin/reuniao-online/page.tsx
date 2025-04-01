// components/ReuniaoOnline.tsx
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { CalendarClock, ExternalLink } from "lucide-react"

export default function ReuniaoOnline() {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-10 p-4">
      <CardHeader className="flex items-center gap-2">
        <CalendarClock className="w-6 h-6 text-blue-500" />
        <CardTitle>Reunião Online</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input placeholder="Título da reunião" />
        <Textarea placeholder="Escreva aqui a ata da reunião..." className="min-h-[150px]" />
        <Input placeholder="Cole aqui o link do Google Meet" />
        <div className="flex gap-4 justify-end">
          <Button variant="outline">Salvar Ata</Button>
          <Button asChild>
            <a href="https://meet.google.com/" target="_blank" rel="noopener noreferrer">
              Entrar no Meet <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
