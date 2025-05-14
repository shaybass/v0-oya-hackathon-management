"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useAuth } from "@/components/auth-provider"

const formSchema = z.object({
  username: z.string().min(1, {
    message: "שם משתמש הוא שדה חובה",
  }),
  password: z.string().min(1, {
    message: "סיסמה היא שדה חובה",
  }),
})

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // בדיקת פרטי כניסה קבועים
      if (values.username === "shaymoyal" && values.password === "oya1234") {
        // התחברות מוצלחת
        login(values.username)

        toast({
          title: "התחברות מוצלחה",
          description: "ברוך הבא למערכת ניהול האקתונים",
        })

        router.push("/")
      } else {
        // התחברות נכשלה
        toast({
          title: "התחברות נכשלה",
          description: "שם משתמש או סיסמה שגויים",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת ההתחברות",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Image
              src="/placeholder.svg?height=64&width=64"
              alt="OYA HACKATHON Logo"
              width={64}
              height={64}
              className="rounded"
            />
          </div>
          <CardTitle className="text-2xl">התחברות למערכת</CardTitle>
          <CardDescription>הזן את פרטי הכניסה שלך כדי להתחבר למערכת ניהול האקתונים</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם משתמש</FormLabel>
                    <FormControl>
                      <Input placeholder="הזן את שם המשתמש שלך" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>סיסמה</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="הזן את הסיסמה שלך" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "מתחבר..." : "התחבר"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">OYA HACKATHON &copy; {new Date().getFullYear()}</p>
        </CardFooter>
      </Card>
    </div>
  )
}
