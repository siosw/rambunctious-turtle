function submitComment(event) {
  const data = new FormData(event.target)
  const body = JSON.stringify({
    text: data.get('comment'),
    author: 'siosw',
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

async function loadComments() {
  const comments = await fetch('/comments').then(res => res.json())
  const commentsDiv = document.getElementById('comments')

  commentsDiv.innerHTML = ''

  comments.forEach(c => {
    const commentText = document.createElement('p')
    commentText.innerText = c.text
    commentsDiv.appendChild(commentText)
  })

}

document.getElementById('commentForm').addEventListener('submit', submitComment)
loadComments()