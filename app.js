// 할 일 데이터를 저장하는 배열
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 현재 선택된 필터 ('all' | 'active' | 'completed')
let currentFilter = 'all';

// --- 탭 UI 동적 생성 (index.html을 수정하지 않기 위해 JS로 삽입) ---
function createTabs() {
  const tabsEl = document.createElement('div');
  tabsEl.className = 'tabs';
  tabsEl.innerHTML = `
    <button class="tab-btn active" data-filter="all">
      전체 <span class="badge" id="badge-all">0</span>
    </button>
    <button class="tab-btn" data-filter="active">
      진행중 <span class="badge" id="badge-active">0</span>
    </button>
    <button class="tab-btn" data-filter="completed">
      완료 <span class="badge" id="badge-completed">0</span>
    </button>
  `;

  // 입력 영역 바로 아래에 탭 삽입
  const inputArea = document.querySelector('.input-area');
  inputArea.insertAdjacentElement('afterend', tabsEl);

  // 탭 클릭 이벤트
  tabsEl.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      tabsEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });
}

// --- 데이터 저장 ---
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// --- 할 일 추가 ---
function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  todos.push({ id: Date.now(), text: trimmed, completed: false });
  saveTodos();
  render();
}

// --- 완료 상태 토글 ---
function toggleTodo(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  render();
}

// --- 개별 항목 삭제 ---
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  render();
}

// --- 완료된 항목 전부 삭제 ---
function clearCompleted() {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  render();
}

// --- 필터에 맞는 항목만 반환 ---
function getFilteredTodos() {
  if (currentFilter === 'active') return todos.filter(t => !t.completed);
  if (currentFilter === 'completed') return todos.filter(t => t.completed);
  return todos;
}

// --- 탭 뱃지 숫자 업데이트 ---
function updateBadges() {
  const allCount = todos.length;
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  const badgeAll = document.getElementById('badge-all');
  const badgeActive = document.getElementById('badge-active');
  const badgeCompleted = document.getElementById('badge-completed');

  if (badgeAll) badgeAll.textContent = allCount;
  if (badgeActive) badgeActive.textContent = activeCount;
  if (badgeCompleted) badgeCompleted.textContent = completedCount;
}

// --- 화면 렌더링 ---
function render() {
  const list = document.getElementById('todoList');
  const filtered = getFilteredTodos();

  // 목록 비우기
  list.innerHTML = '';

  if (filtered.length === 0) {
    const emptyMsg = {
      all: '할 일이 없습니다.',
      active: '진행중인 할 일이 없습니다.',
      completed: '완료된 할 일이 없습니다.',
    };
    list.innerHTML = `<p class="empty-msg">${emptyMsg[currentFilter]}</p>`;
  } else {
    filtered.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.completed ? ' completed' : '');
      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}" />
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button class="delete-btn" data-id="${todo.id}" title="삭제">✕</button>
      `;
      list.appendChild(li);
    });
  }

  // 미완료 개수 및 탭 뱃지 업데이트
  const activeCount = todos.filter(t => !t.completed).length;
  document.getElementById('itemCount').textContent = `${activeCount}개 남음`;
  updateBadges();
}

// XSS 방지: 특수문자를 HTML 엔티티로 변환
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --- 이벤트 연결 ---

// 추가 버튼 클릭
document.getElementById('addBtn').addEventListener('click', () => {
  const input = document.getElementById('todoInput');
  addTodo(input.value);
  input.value = '';
  input.focus();
});

// Enter 키로도 추가
document.getElementById('todoInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('addBtn').click();
});

// 목록 내 클릭 이벤트 (이벤트 위임)
document.getElementById('todoList').addEventListener('click', e => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  if (e.target.type === 'checkbox') toggleTodo(id);
  if (e.target.classList.contains('delete-btn')) deleteTodo(id);
});

// 완료 항목 삭제 버튼
document.getElementById('clearBtn').addEventListener('click', clearCompleted);

// 페이지 로드 시 탭 생성 후 초기 렌더링
createTabs();
render();
