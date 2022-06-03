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

function renderReplies(comment) {
  const commentsDiv = document.getElementById('comments')

  comment.replies.forEach(r => {
    const replyDiv = document.createElement('div')
    replyDiv.classList.add('w-[55vw]', 'px-8', 'py-2', 'ml-10', 'border', 'rounded', 'relative')

    const replyText = document.createElement('p')
    replyText.innerText = r.text
    
    const replyAuthor = document.createElement('h4')
    replyAuthor.classList.add('font-bold')
    replyAuthor.innerText = r.author

    replyDiv.appendChild(replyAuthor)
    replyDiv.appendChild(replyText)
    commentsDiv.appendChild(replyDiv)
  })
}

async function loadComments() {
  const comments = await fetch('/comments').then(res => res.json())
  const commentsDiv = document.getElementById('comments')

  commentsDiv.innerHTML = ''

  comments.forEach((c, i) => {
    const commentDiv = document.createElement('div')
    commentDiv.classList.add('w-[60vw]', 'px-8', 'py-2', 'border', 'rounded', 'relative')
    commentDiv.id = i

    const commentText = document.createElement('p')
    commentText.innerText = c.text
    
    const commentAuthor = document.createElement('h4')
    commentAuthor.classList.add('font-bold')
    commentAuthor.innerText = c.author

    const commentInteractions = document.createElement('div')
    const root = ReactDOM.createRoot(commentInteractions)
    root.render(
      <div className="flex space-x-2 items-center">
        <Upvote 
          id={ i }
          initialUpvoteCount={ c.upvotes }
          socket={ socket }
        />
        <Reply 
          id={ i }
        />
      </div>
    )

    commentDiv.appendChild(commentAuthor)
    commentDiv.appendChild(commentText)
    commentDiv.appendChild(commentInteractions)
  
    commentsDiv.appendChild(commentDiv)

    renderReplies(c)
  })
}

document.getElementById('commentForm').addEventListener('submit', submitComment)
loadComments()