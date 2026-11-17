// All calls to the Spring Boot backend live in this one file.

// Same fields as your Excuses.java entity (id is created by the database)
export type Excuse = {
  id?: number
  situation: string
  excuse: string
  believality: number // 0 - 100
}

const BASE = '/excuses'

// READ   GET /excuses/getall  -> list of excuses
export async function getAll(): Promise<Excuse[]> {
  const res = await fetch(`${BASE}/getall`)
  const type = res.headers.get('content-type') ?? ''
  // If we got a web page instead of JSON, the request never reached Spring Boot
  if (!res.ok || !type.includes('application/json')) {
    throw new Error(
      'Cannot reach the backend. Start Spring Boot (port 8080) and restart "npm run dev".',
    )
  }
  return res.json()
}

// CREATE POST /excuses/create  -> body: new excuse, returns nothing
export async function createExcuse(ex: Excuse): Promise<void> {
  const res = await fetch(`${BASE}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ex),
  })
  if (!res.ok) throw new Error('Could not create the excuse')
}

// UPDATE PUT /excuses/update/{id}  -> body: changed excuse, returns true
export async function updateExcuse(id: number, ex: Excuse): Promise<void> {
  const res = await fetch(`${BASE}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ex),
  })
  if (!res.ok) throw new Error('Could not update the excuse')
}

// DELETE DELETE /excuses/del/{id}  -> returns a text message
export async function deleteExcuse(id: number): Promise<void> {
  const res = await fetch(`${BASE}/del/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Could not delete the excuse')
}
