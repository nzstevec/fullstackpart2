import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'
import './index.css'

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      Filter shown by <input value={search} onChange={handleSearchChange} />
    </div>
  )
}

const Persons = ({ persons, search, deletePerson }) => {
  return (
    persons
      .filter(person => person.name.search(new RegExp(search, "i")) >= 0)
      .map(person => {
        return (
          <li className='note' key={person.id}>
            {person.name}/{person.number}
            <button onClick={() => deletePerson(person)}>delete</button>
          </li>
        )
      })
  )
}

const PersonForm = ({
  newName, newNumber, handleNewNameChange, handleNewNumberChange, addName
}) => {
  return (
    <form onSubmit={addName}>
      <div>
        <p />
        name: <input value={newName} onChange={handleNewNameChange} />
        <p />
        number: <input value={newNumber} onChange={handleNewNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='notification'>
      {message}
    </div>
  )
}

const notify = (setNotification, what, timeoutId) => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  setNotification(what)
  timeoutId = setTimeout(() => {
    setNotification(null)
  }, 5000)
  return timeoutId
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    loadPersons()
  }, [])

  const loadPersons = () => {
    personsService
      .getAll()
      .then(p => {
        setPersons(p)
      })
  }

  const handleNewNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNewNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
  }

  const findPerson = (newName, persons) => {
    return persons.find(person => person.name === newName)
  }

  const addName = (event) => {
    event.preventDefault()
    var timeoutId = null
    console.log("add name event",event)
    const person = findPerson(newName, persons)
    if (person !== undefined) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
        person.number = newNumber
        console.log("updating person",person)
        timeoutId = notify(setNotification, `Updating '${person.name}'`, timeoutId)
        personsService
          .update(person.id,person)
          .then(p => {
            console.log("update person response",p)
            timeoutId = notify(setNotification, `Updated '${person.name}' successfully`,timeoutId)
            loadPersons()
          })
          .catch(error => {
            console.log("error on update",error);
            timeoutId = notify(setNotification, `Information on '${person.name}', has already been deleted`,timeoutId)
            loadPersons()
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      timeoutId = notify(setNotification, `Adding '${newPerson.name}'`, timeoutId)
      personsService
        .create(newPerson)
        .then(p => {
          setPersons(persons.concat(p))
          setNewName('')
          setNewNumber('')
          timeoutId = notify(setNotification, `Added '${newPerson.name}' successfully`, timeoutId)
        })

    }
  }

  const deletePersonById = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .del(person.id)
        .then(p => {
          console.log("delete response", p)
          loadPersons()
          notify(setNotification, `Deleted '${person.name}' successfully`,null)
        })
    }
  }

  return (
    <>
      <h1>Phonebook</h1>
      <Notification message={notification} />
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNewNameChange={handleNewNameChange}
        handleNewNumberChange={handleNewNumberChange}
        addName={addName}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} deletePerson={deletePersonById} />
    </>
  )
}

export default App
