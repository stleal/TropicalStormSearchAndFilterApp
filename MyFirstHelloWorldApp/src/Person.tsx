import { useState } from 'react'

interface Person {
  Person_Name: string
  Age: string
}

function PersonForm() {
  const [person, setPerson] = useState<Person>({
    Person_Name: 'Alice',
    Age: '26',
  })
  const [output, setOutput] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPerson((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setOutput(JSON.stringify(person, null, 2))
  }

  return (
    <div className="person-form">
      <h2>Person Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Person_Name">Person Name:</label>
          <input
            id="Person_Name"
            name="Person_Name"
            type="text"
            value={person.Person_Name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="Age">Age:</label>
          <input
            id="Age"
            name="Age"
            type="text"
            value={person.Age}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {output !== null && (
        <pre className="person-output">{output}</pre>
      )}
    </div>
  )
}

export default PersonForm
