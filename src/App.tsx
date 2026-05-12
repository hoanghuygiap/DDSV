import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">React + Tailwind v4 + Shadcn UI</h1>
        <p className="text-gray-600 mb-6">Shadcn UI đã được tích hợp thành công!</p>
        <Button>Click me (Shadcn Button)</Button>
      </div>
    </div>
  )
}

export default App
