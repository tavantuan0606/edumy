let currentSectionIndex = null;

function showVideos(sectionIndex) {
  currentSectionIndex = sectionIndex;

  const section = course.driveStructure[sectionIndex];
  const container = document.getElementById('videoListContainer');

  if (!section || !section.videos || section.videos.length === 0) {
    container.innerHTML = `<p class="text-warning">No videos found in this section.</p>`;
    return;
  }

  // Sắp xếp từ nhỏ đến lớn theo số thứ tự đầu tên video
  const sortedVideos = section.videos.slice().sort((a, b) => {
  const getNum = str => {
    const match = str.match(/^\\d{1,3}/); // lấy số đầu tiên: 1–3 chữ số
    return match ? parseInt(match[0], 10) : 0;
  };

  const numA = getNum(a.name);
  const numB = getNum(b.name);

  if (numA !== numB) return numA - numB;
  return a.name.localeCompare(b.name); // fallback theo tên nếu trùng số
  });

  let html = `<h6>Videos in ${section.section || 'Section ' + (sectionIndex + 1)}:</h6><ul class="list-group">`;
  sortedVideos.forEach(video => {
  const isChecked = completedVideos.some(v => v.split('?')[0] === video.preview.split('?')[0]) ? 'checked' : '';
  html += `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <div>
        ${video.name}
        <button class="btn btn-sm btn-outline-secondary ms-2" onclick="playVideo('${video.preview}')">Watch</button>
      </div>
      <div>
        <input type="checkbox"
               class="form-check-input"
               style="transform: scale(1.5);"
               onchange="toggleProgress('${video.preview}', this.checked)"
               ${isChecked}>
      </div>
    </li>`;
    });
  html += `</ul>`;
  container.innerHTML = html;

  // Hiện phần ghi chú tương ứng section
  document.getElementById('courseInfo').style.display = 'none';
  document.getElementById('videoNoteSection').style.display = 'block';
  document.querySelectorAll('.section-note').forEach((note, i) => {
    note.style.display = i === currentSectionIndex ? 'block' : 'none';
  });
}


function playVideo(link) {
  // Ẩn phần hình ảnh
  const imageContainer = document.getElementById('imageContainer');
  if (imageContainer) imageContainer.style.display = 'none';

  // Hiện video player
  const player = document.getElementById('videoPlayerContainer');
  const iframe = document.getElementById('videoIframe');
  iframe.src = link;
  player.style.display = 'block';
}


function toggleProgress(videoUrl, isCompleted) {
  fetch(`/courses/${course._id}/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ video: videoUrl, completed: isCompleted })
  })
    .then(async res => {
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Lỗi ${res.status}: ${errorText}`);
      }
      return res.json();
    })
    .then(data => {
      if (!data.success) {
        console.warn('[Lỗi lưu tiến độ]', data.error);
        alert('Không thể lưu tiến độ học. Vui lòng thử lại.');
      } else {
        // ✅ Cập nhật danh sách completedVideos trên client
        const normalized = videoUrl.split('?')[0];

        if (isCompleted && !completedVideos.includes(normalized)) {
          completedVideos.push(normalized);
        } else if (!isCompleted) {
          const idx = completedVideos.findIndex(v => v.split('?')[0] === normalized);
          if (idx !== -1) completedVideos.splice(idx, 1);
        }

        updateProgressUI();
      }
    })
    .catch(err => {
      console.error('[Lỗi JS khi cập nhật tiến độ]', err);
      alert('Có lỗi xảy ra khi lưu tiến độ.');
    });
}


function saveNote(index) {
  const content = document.getElementById(`note-section-${index}`).value;

  fetch(`/courses/${course._id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sectionIndex: index, content })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) alert('Lưu ghi chú thất bại');
    })
    .catch(err => console.error('[Lỗi lưu ghi chú]', err));
}
function updateProgressUI() {
  const checkedCount = completedVideos.length;
  const total = course.driveStructure.reduce((acc, sec) => acc + sec.videos.length, 0);
  const percent = Math.round((checkedCount / total) * 100);

  const bar = document.querySelector('.progress-bar');
  const label = document.querySelector('.text-success');

  bar.style.width = `${percent}%`;
  bar.setAttribute('aria-valuenow', checkedCount);
  label.innerText = `Tiến độ học: ${checkedCount} / ${total} video (${percent}%)`;
}
