const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p>Number of exercises {sum}</p>

const Part = ({ part }) =>
  <p>
    {part.name} {part.exercises}
  </p>

const totalExercises = ({ parts }) =>
  parts.reduce((previous, current) => previous + current.exercises, 0)

const Content = ({ parts }) =>
  <>
    {parts.map((part) => {
      return (
        <Part
          key={part.id} part={part}
        />
      )
    })}
    <p>Total of {totalExercises({ parts })} exercises</p>
  </>

const Course = ({ course, parts }) => {
  return (
    <>
      <Header course={course} />
      <Content parts={parts} />
    </>
  )
}

export default Course