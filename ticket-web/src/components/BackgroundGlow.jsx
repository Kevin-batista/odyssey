function BackgroundGlow() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">

      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[140px] rounded-full top-[-120px] left-[-120px] animate-pulse" />

      <div className="absolute w-[400px] h-[400px] bg-pink-500/20 blur-[140px] rounded-full bottom-[-120px] right-[-120px] animate-pulse" />

      <div className="absolute w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full top-[40%] left-[60%] animate-pulse" />

    </div>
  )
}

export default BackgroundGlow