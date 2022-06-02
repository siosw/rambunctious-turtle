function submitComment(event) {
  const data = new FormData(event.target)
  const body = JSON.stringify({
    text: data.get('comment'),
    author: getRandomAuthor(),
    upvotes: 0,
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

async function loadComments() {
  const comments = await fetch('/comments').then(res => res.json())
  const commentsDiv = document.getElementById('comments')

  commentsDiv.innerHTML = ''

  comments.forEach((c, i) => {
    const commentDiv = document.createElement('div')
    commentDiv.classList.add('w-[60vw]', 'px-8', 'py-2', 'border', 'rounded')
    commentDiv.id = i

    const commentText = document.createElement('p')
    commentText.innerText = c.text
    
    const commentAuthor = document.createElement('h4')
    commentAuthor.classList.add('font-bold')
    commentAuthor.innerText = c.author

    const commentUpvotes = document.createElement('div')
    const root = ReactDOM.createRoot(commentUpvotes)
    root.render(
      <Upvote 
        id={ i }
        upvoteCount={ c.upvotes }
      />
    )

    commentDiv.appendChild(commentAuthor)
    commentDiv.appendChild(commentText)
    commentDiv.appendChild(commentUpvotes)
  
    commentsDiv.appendChild(commentDiv)
  })
}

document.getElementById('commentForm').addEventListener('submit', submitComment)
loadComments()