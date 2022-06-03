const socket = io()

function submitComment(event) {
  const data = new FormData(event.target)
  const body = JSON.stringify({
    text: data.get('comment'),
    author: getRandomAuthor(),
    upvotes: 0,
    replies: [],
  })

  fetch('/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body,
  })

  loadComments()
  event.target.reset()
  event.preventDefault()
}

function getRandomAuthor() {
  const authors = [
    'Rob Hope',
    'Sophie Brecht',
    'James',
    'Cameron Lawrence',
  ]
  return authors[Math.floor(Math.random() * authors.length)]
}

function renderComment(comment, commentId, replyId) {
  const commentDiv = document.createElement('div')
  if (comment.isReply) commentDiv.classList.add('w-[55vw]')
  else commentDiv.classList.add('w-[60vw]')
  commentDiv.classList.add('px-8', 'py-2', 'border', 'rounded', 'relative')
  commentDiv.id = commentId

  const commentText = document.createElement('p')
  commentText.innerText = comment.text
  
  const commentAuthor = document.createElement('h4')
  commentAuthor.classList.add('font-bold')
  commentAuthor.innerText = comment.author

  const commentInteractions = document.createElement('div')
  const root = ReactDOM.createRoot(commentInteractions)
  root.render(
    <div>
      { !comment.isReply ? (
      <div className="flex space-x-2 items-center" >
      <Upvote 
        id={ commentId }
        initialUpvoteCount={ comment.upvotes }
        socket={ socket }
      />
      <Reply 
        id={ commentId }
      />
      </div>
      ) : (
      <div className="flex space-x-2 items-center" >
      <ReplyUpvote 
        commentId={ commentId }
        replyId={ replyId }
        initialUpvoteCount={ comment.upvotes }
        socket={ socket }
      />
      </div>
      )}
    </div>

  )
  commentDiv.appendChild(commentAuthor)
  commentDiv.appendChild(commentText)
  commentDiv.appendChild(commentInteractions)

  return commentDiv
}

function loadReplies(comment, commentId) {
  const commentsDiv = document.getElementById('comments')

  comment.replies.forEach((r, i) => {
    const replyDiv = renderComment(r, commentId, i)
    commentsDiv.appendChild(replyDiv)
  })
}

async function loadComments() {
  const comments = await fetch('/comments').then(res => res.json())
  const commentsDiv = document.getElementById('comments')

  commentsDiv.innerHTML = ''

  comments.forEach((c, i) => {
    const commentDiv = renderComment(c, i)
    commentsDiv.appendChild(commentDiv)
    loadReplies(c, i)
  })
}

document.getElementById('commentForm').addEventListener('submit', submitComment)
loadComments()