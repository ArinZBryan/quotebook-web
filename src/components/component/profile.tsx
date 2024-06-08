import { useState, useEffect } from 'react'
 
export function Profile() {
  const [data, setData] = useState("")
  const [isLoading, setLoading] = useState(true)
 
  useEffect(() => {
    fetch('/api/db/getAll')
      .then((res) => res.json())
      .then((data) => {
        setData(JSON.stringify(data))
        setLoading(false)
      })
  }, [])
 
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>
 
  return (
    <div>
      {JSON.stringify(data)}
    </div>
  )
}