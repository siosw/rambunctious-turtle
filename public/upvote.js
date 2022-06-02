function Upvote({ id, upvoteCount }) {
  async function onUpvote() {
    const body = JSON.stringify({ commentIndex: id })
    await fetch('/upvote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body,
    })
    
    // globally reload comments to refresh count
    // this will be unecessary once we add live refresh
    loadComments()
  }

  return (
    <div className="flex space-x-2 font-bold text-gray-500 text-small">
      <p>{ upvoteCount }</p>
      <button onClick={ () => onUpvote() } className="font-bold">Upvote</button>
    </div>
  )
}