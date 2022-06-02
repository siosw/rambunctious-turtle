function Upvote({ id, initialUpvoteCount, socket }) {
  const [upvoteCount, setUpvoteCount] = React.useState(initialUpvoteCount)
  function onUpvote() {
    socket.emit('upvote', id)
  }

  React.useEffect(() => {
    socket.on('upvote_changed', (commentIndex) => {
      
      console.log(id, commentIndex)
      if (commentIndex === id) {
        console.log('set called')
        setUpvoteCount(upvoteCount + 1)
      }

      console.log('upvote!', upvoteCount)
    })
  })

  return (
    <div className="flex space-x-2 font-bold text-gray-500 text-small">
      <p>{ upvoteCount }</p>
      <button onClick={ () => onUpvote() } className="font-bold">Upvote</button>
    </div>
  )
}