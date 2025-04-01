import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone } from "lucide-react"

export default function Ouvidoria() {
  return (
    <Card className="w-full max-w-lg mx-auto p-4 mt-10">
      <CardHeader className="flex items-center gap-2">
        <Megaphone className="w-6 h-6 text-yellow-600" />
        <CardTitle>Ouvidoria</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Textarea placeholder="Deixe seu comentário ou sugestão aqui..." className="min-h-[120px]" />
        <Button className="self-end">Enviar</Button>
      </CardContent>
    </Card>
  )
}
