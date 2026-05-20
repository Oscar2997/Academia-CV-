alert("ADMIN JS CARGADO");

window.openAdminPanel = async function() {

  document.getElementById(
    "admin-panel"
  ).style.display = "block";

  const {
    collection,
    getDocs
  } = await import(
    "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js"
  );

  // FIREBASE

  const usersSnapshot = await getDocs(
    collection(window.db, "users")
  );

  const scoresSnapshot = await getDocs(
    collection(window.db, "quiz_scores")
  );

  // ARRAYS

  const users = [];

  usersSnapshot.forEach(doc => {

    users.push({
      id: doc.id,
      ...doc.data()
    });

  });

  const scores = [];

  scoresSnapshot.forEach(doc => {

    scores.push({
      id: doc.id,
      ...doc.data()
    });

  });

  // HTML FINAL

  let html = "";

  users.forEach(user => {

    // BUSCAR DATOS DEL USUARIO

    const userScores =
    scores.find(s =>
      s.email &&
      user.email &&
      s.email.trim().toLowerCase() ===
      user.email.trim().toLowerCase()
    );

    // STATS

    const stats =
    userScores?.stats || {};

    const avg =
    stats.overallAverage || 0;

    const totalAttempts =
    stats.totalAttempts || 0;

    const totalQuizzes =
    stats.totalQuizzes || 0;

    // HISTORIAL

    let historyHTML = "";

    if(
      userScores &&
      userScores.scores
    ) {

      Object.entries(
        userScores.scores
      ).forEach(([quiz, value]) => {

        if(
          typeof value === "object"
        ) {

          historyHTML += `

            <div style="
              background:#f5f7fb;
              padding:12px;
              border-radius:10px;
              margin-top:10px;
            ">

              <strong>
                Quiz ${quiz}
              </strong>

              <br>

              Nota:
              ${value.lastScore || 0}%

              <br>

              Intentos:
              ${value.attempts || 0}

              <br>

              Promedio:
              ${value.average || 0}%

            </div>

          `;

        }

      });

    }

    // CARD

    html += `

      <div style="
        border:1px solid #ddd;
        border-radius:16px;
        padding:20px;
        margin-bottom:20px;
        background:white;
        box-shadow:
        0 2px 10px rgba(0,0,0,0.05);
      ">

        <h3 style="
          margin-bottom:10px;
          color:#0B2137;
        ">
          ${user.email || "Sin correo"}
        </h3>

        <p style="
          color:#666;
          font-size:14px;
        ">
          Último Login:
          ${user.lastLogin || "No disponible"}
        </p>

        <div style="
          margin-top:15px;
          display:grid;
          grid-template-columns:
          repeat(3,1fr);
          gap:10px;
        ">

          <div style="
            background:#f5f7fb;
            padding:15px;
            border-radius:12px;
            text-align:center;
          ">

            <div style="
              font-size:24px;
              font-weight:bold;
              color:#00B9D6;
            ">
              ${avg}%
            </div>

            <div style="
              font-size:13px;
              color:#666;
            ">
              Promedio
            </div>

          </div>

          <div style="
            background:#f5f7fb;
            padding:15px;
            border-radius:12px;
            text-align:center;
          ">

            <div style="
              font-size:24px;
              font-weight:bold;
              color:#0B2137;
            ">
              ${totalQuizzes}
            </div>

            <div style="
              font-size:13px;
              color:#666;
            ">
              Quizzes
            </div>

          </div>

          <div style="
            background:#f5f7fb;
            padding:15px;
            border-radius:12px;
            text-align:center;
          ">

            <div style="
              font-size:24px;
              font-weight:bold;
              color:#28a745;
            ">
              ${totalAttempts}
            </div>

            <div style="
              font-size:13px;
              color:#666;
            ">
              Intentos
            </div>

          </div>

        </div>

        <div style="
          margin-top:20px;
        ">

          <strong>
            Historial de Quizzes:
          </strong>

          ${historyHTML || `
            <p style="
              color:#999;
              font-size:13px;
              margin-top:10px;
            ">
              Sin quizzes registrados
            </p>
          `}

        </div>

      </div>

    `;

  });

  document.getElementById(
    "admin-users"
  ).innerHTML = html;

};

// CERRAR PANEL

window.closeAdminPanel = function() {

  document.getElementById(
    "admin-panel"
  ).style.display = "none";

};