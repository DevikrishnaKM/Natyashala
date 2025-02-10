import { Star, Clock, Book } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import React from "react"
import { useNavigate } from "react-router-dom"

interface Tutor{
    name : string | "",
    profile : string | "";
    id : string | "";

}
const  TutorProfileCard : React.FC<Tutor> = ({name , profile , id}) => {
  const navigate = useNavigate()
  return (
    <Card className="w-full  h-full">
      <CardContent className="flex items-center gap-6 p-6">
        <Avatar className="h-32 w-32">
          <AvatarImage src={profile} alt="Tutor's profile picture" className="object-cover"/>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col gap-2 flex-grow">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{name}</h2>
              <p className="text-muted-foreground">Dance Tutor</p>
            </div>
            <Button className="bg-black text-white "
            onClick={() => navigate(`/tutorDetails/${id}`)}>View tutor</Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">4.9</span>
              <span className="text-muted-foreground">(12 reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>5+ years experience</span>
            </div>
           
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge>BharathaNatyam</Badge>
            <Badge>Mohiniyattam</Badge>
            <Badge>Kuchuppudi</Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Passionate dance tutor specializing in high school and college-level arts festival. 
            My approach focuses on building strong foundations and Perfection.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
export default TutorProfileCard;