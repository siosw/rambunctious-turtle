function Reply({ id }) {
  const [displayForm, setDisplayForm] = React.useState(false)
  const [replyText, setReplyText] = React.useState('')

  function toggleReply() {
    setDisplayForm(!displayForm)
  }

  async function submitReply(event) {
    setDisplayForm(false)

    const reply = {
      text: replyText,
      author: getRandomAuthor(),
      upvotes: 0,
      isReply: true,
    }
    await fetch('/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reply,
        commentIndex: id,
      }),
    })
  
    // globally reload all comments
    loadComments()
    setReplyText('')
    event.preventDefault()
  }

  return (
    <div className="flex space-x-2">
      <button 
        onClick={ () => toggleReply() } 
        className="font-bold text-gray-500 text-small">Reply
      </button>
      { 
        displayForm &&
        <div>
          <form onSubmit={ e => submitReply(e) } className="flex space-x-2">
            <input 
              type="text" 
              name="comment" 
              placeholder="What are your thoughts?" 
              required 
              value={ replyText }
              onChange={ e => setReplyText(e.target.value) }
              className="border rounded-md px-2 py-1 w-[70vw] max-w-md" />
            <button 
              type="submit" 
              className="rounded-md bg-purple-600 px-2 py-1 text-white">Comment
            </button>
          </form>
        </div>
      }
    </div>


  )
}