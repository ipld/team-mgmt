// Return the placeholder if the input field doesn't have a value set
const valueOrPlaceholder = (inputId) => {
  const input = document.getElementById(inputId)
  if (input.value) {
    return input.value
  } else {
    return input.placeholder
  }
}

// Replace every occurence of `${date}` with the given date
const replaceDate = (input, date) => {
  return input.replace(/\$\{date\}/g, date)
}

// Split the commit message into its subject and description
const splitCommitMessage = (message) => {
  let [subject, ...description] = message.split('\n\n')
  if (description === undefined) {
      description = ''
  } else {
      description = description.join('\n\n')
  }
  return [subject, description]
}

// Parse the location where the file should be stored
const parseDestination = (destination) => {
  const [_empty, org, repo, _blob, branch, ...filepath] = decodeURI(
    new URL(destination).pathname
  ).split('/')
  const filenameLiteral = filepath.pop()
  const directory = filepath.join('/')
  return { org, repo, branch, directory, filenameLiteral }
}

// Get all the values to construct the URL
const getValues = async () => {
  const notesUrl = valueOrPlaceholder('notes')
  const notes = await (await fetch(notesUrl, {cache: 'no-store'})).text()
  const date = valueOrPlaceholder('date')
  const destination = valueOrPlaceholder('destination')
  const {
    org, repo, branch, directory, filenameLiteral
  } = parseDestination(destination)
  const filename = replaceDate(filenameLiteral, date)
  const targetBranch = replaceDate(valueOrPlaceholder('branch'), date)
  const commitMessage = replaceDate(valueOrPlaceholder('commit-message'), date)
  const [commitSubject, commitDescription] = splitCommitMessage(commitMessage)
  return {
    org, repo, branch, directory, filename, targetBranch, commitSubject,
    commitDescription, notes
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Set to todays date by default
  document.getElementById('date').valueAsDate = new Date()

  // Create the actual PR
  document.getElementsByTagName('form')[0].addEventListener('submit', async (event) => {
    // Don't submit, we do everything through JS
    event.preventDefault()

    const {
      org, repo, branch, directory, filename, targetBranch, commitSubject,
      commitDescription, notes
    } = await getValues()

    // Encode everything correctly
    let url = encodeURI(`https://github.com/${org}/${repo}/new/${branch}?filename=${directory}/${filename}&quick_pull=master&target_branch=${targetBranch}&message=${commitSubject}&description=${commitDescription}&value=`)
    url += encodeURIComponent(notes)

    // Send the user to the new PR
    window.location.href = url
  })
})
