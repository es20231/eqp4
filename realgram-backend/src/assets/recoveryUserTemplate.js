const recoveryUserTemplate = (token) => {
  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Recuperação de Senha - Realgram</title>
      </head>
      <body
        style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f6f6f6;
    "
      >
        <div
          class="container"
          style="
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      "
        >
          <div class="header" style="text-align: center; padding: 20px 0">
            <div
              class="title"
              style="font-size: 24px; color: #262626; margin: 10px 0"
            >
              Recuperação de Senha - Realgram
            </div>
            <div
              class="subtitle"
              style="font-size: 16px; color: #999; margin: 20px 0"
            >
              Sua conta Realgram
            </div>
          </div>
          <div
            class="token-box"
            style="
          padding: 15px;
          background-color: #f0f0f0 !important;
          border-radius: 5px;
          text-align: center;
        "
          >
            <div
              class="token"
              id="token"
              style="
            font-size: 20px;
            font-weight: bold;
            background-color: #fafafa !important;
            padding: 10px;
            border-radius: 5px;
          "
            >
              ${token}
            </div>
            
            <p>Copie o token acima e utilize-o para realizar a alteração da sua senha.</p>

            <button
          id="copyButton"
          class="copy-button"
          style="
            margin-top: 20px;
            background-color: #3897f0 !important;
            color: #fff !important;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
          "
        >
          Copiar código de recuperação
        </button>
         </div>
      <script>
        document.getElementById("copyButton").addEventListener("click", copyTokenToClipboard);

        function copyTokenToClipboard() {
          const tokenElement = document.getElementById("token");
          const range = document.createRange();
          range.selectNode(tokenElement);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          document.execCommand("copy");
          window.getSelection().removeAllRanges();
        }
      </script>
    </body>
    </html>
  `;

  return emailTemplate;
};

module.exports = recoveryUserTemplate;
