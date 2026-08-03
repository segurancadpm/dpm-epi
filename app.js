// ─── Event listeners ──────────────────────────────────────────────────────────
document.addEventListener("pointerdown", ev => {
  const operador = ev.target.closest("[data-operador]")?.dataset.operador;
  if (operador) { state.operadorAtual = operador; render(); return; }

  const loginPin = ev.target.closest("[data-login-user]")?.dataset.loginUser;
  if (loginPin) { state.loginUser = USERS.find(u => u.pin === loginPin); state.pin = ""; renderLogin(); return; }

  const key = ev.target.closest("[data-key]")?.dataset.key;
  if (key) {
    state.pin = state.pin || "";
    if (key === "⌫") state.pin = state.pin.slice(0, -1);
    else if (key === "OK") tryLogin();
    else if (state.pin.length < 4) state.pin += key;
    if (state.pin.length === 4) tryLogin();
    else renderLogin();
    return;
  }

  const page = ev.target.closest("[data-page]")?.dataset.page;
  if (page) { state.page = page; state.selectedWorkerId = null; render(); return; }

  const actionTarget = ev.target.closest("[data-action]");
  const action = actionTarget?.dataset.action;
  if (action) { handleAction(action, actionTarget); return; }

  const workerId = ev.target.closest("[data-worker]")?.dataset.worker;
  if (workerId) { state.selectedWorkerId = Number(workerId); render(); return; }

  const modal = ev.target.closest("[data-modal]")?.dataset.modal;
  if (modal) {
    const modalMap = {
      worker: workerModal,
      delivery: deliveryModal,
      audit: auditModal,
      article: articleModal,
      budget: budgetModal,
      operadores: operadoresModal
    };
    modalMap[modal]?.();
    return;
  }

  const renewAlertId = ev.target.closest("[data-renew-alert]")?.dataset.renewAlert;
  if (renewAlertId) {
    const alertEvent = alerts().find(a => a.id === renewAlertId);
    if (alertEvent) { state.selectedWorkerId = alertEvent.idTrab; deliveryModal(alertEvent.epi); }
    return;
  }

  const delOp = ev.target.closest("[data-del-op]")?.dataset.delOp;
  if (delOp !== undefined) {
    state.data.operadores.splice(Number(delOp), 1);
    saveAll();
    operadoresModal();
    return;
  }

  const entry = ev.target.closest("[data-entry]")?.dataset.entry;
  if (entry) entryModal(entry);

  if (ev.target.matches("[data-close-modal]")) closeModal();

  // Botão guardar preços
  if (ev.target.id === "save-precos") savePrecos();
  if (ev.target.id === "save-budget-limit") saveBudgetLimit();
});