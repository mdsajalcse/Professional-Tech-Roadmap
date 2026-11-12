document.addEventListener('DOMContentLoaded', () => {
  const topics = document.querySelectorAll('.topic-list li');
  const searchInput = document.getElementById('search-input');
  const resetBtn = document.getElementById('reset-btn');

  // Load saved progress
  const savedProgress = JSON.parse(localStorage.getItem('roadmap_progress') || '{}');

  topics.forEach(topic => {
    const id = topic.getAttribute('data-id');
    if (savedProgress[id]) {
      topic.classList.add('completed');
    }

    topic.addEventListener('click', () => {
      topic.classList.toggle('completed');
      savedProgress[id] = topic.classList.contains('completed');
      localStorage.setItem('roadmap_progress', JSON.stringify(savedProgress));
      updateProgress();
    });
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset your progress?')) {
      topics.forEach(topic => topic.classList.remove('completed'));
      localStorage.removeItem('roadmap_progress');
      updateProgress();
    }
  });

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    topics.forEach(topic => {
      const text = topic.innerText.toLowerCase();
      if (text.includes(term)) {
        topic.classList.remove('hidden');
      } else {
        topic.classList.add('hidden');
      }
    });
  });

  function updateProgress() {
    const tracks = ['sysadmin', 'linux', 'swe'];
    let totalTopics = topics.length;
    let totalCompleted = 0;

    tracks.forEach(track => {
      const trackTopics = document.querySelectorAll(`.topic-list[data-track="${track}"] li`);
      const completedTrackTopics = document.querySelectorAll(`.topic-list[data-track="${track}"] li.completed`);
      
      const countSpan = document.getElementById(`${track}-count`);
      const barFill = document.getElementById(`${track}-bar`);

      countSpan.innerText = `${completedTrackTopics.length}/${trackTopics.length} completed`;
      const percentage = (completedTrackTopics.length / trackTopics.length) * 100;
      barFill.style.width = `${percentage}%`;

      totalCompleted += completedTrackTopics.length;
    });

    const overallPercentage = Math.round((totalCompleted / totalTopics) * 100);
    document.getElementById('overall-percentage').innerText = `${overallPercentage}%`;
    document.getElementById('overall-progress-bar').style.width = `${overallPercentage}%`;
  }

  updateProgress();
});