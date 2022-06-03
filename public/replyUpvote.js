function ReplyUpvote({ commentId, replyId,  initialUpvoteCount, socket }) {
  const [upvoteCount, setUpvoteCount] = React.useState(initialUpvoteCount)
  function onUpvote() {
    socket.emit('reply_upvote', commentId, replyId)
  }

  React.useEffect(() => {
    socket.on('reply_upvote_changed', (commentIndex, replyIndex) => {
      if (commentIndex === commentId && replyIndex === replyId) {
        setUpvoteCount(upvoteCount + 1)
      }
    })
  })

  return (
    <div className="flex space-x-2 font-bold text-gray-500 text-small">
      <p>{ upvoteCount }</p>
      <button onClick={ () => onUpvote() } className="font-bold">Upvote</button>
    </div>
  )
}