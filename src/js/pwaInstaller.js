let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  // Guardar o evento para ser usado posteriormente
  deferredPrompt = event;
  // Exibir o botão de instalação
  document.getElementById("installButton").style.display = "block";

  // Prevenir o comportamento padrão do evento
  event.preventDefault();
});

// Lidar com o clique no botão de instalação
document.getElementById("installButton").addEventListener("click", () => {
  // Verificar se existe um evento de instalação pendente
  if (deferredPrompt) {
    // Mostrar a solicitação de instalação
    deferredPrompt.prompt();
    // Aguardar a resposta do usuário
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("Usuário aceitou a instalação");
      } else {
        console.log("Usuário recusou a instalação");
      }
      // Limpar o evento de instalação pendente
      deferredPrompt = null;
    });
  }
});
