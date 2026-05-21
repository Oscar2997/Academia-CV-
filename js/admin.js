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
const totalUsers = users.length;

let totalQuizzes = 0;
let totalAttempts = 0;
let averageSum = 0;
let usersWithAverage = 0;

scores.forEach(user => {

  if(user.stats){

    totalQuizzes +=
    user.stats.totalQuizzes || 0;

    totalAttempts +=
    user.stats.totalAttempts || 0;

    if(user.stats.overallAverage){

      averageSum +=
      user.stats.overallAverage;

      usersWithAverage++;

    }

  }

});

const globalAverage =
usersWithAverage > 0
? Math.round(
averageSum / usersWithAverage
)
: 0;

html += `

<div style="
display:grid;
grid-template-columns:
repeat(auto-fit,minmax(220px,1fr));
gap:20px;
margin-bottom:30px;
">

  <div style="
  background:linear-gradient(
  135deg,
  #00B9D6,
  #14A9C4
  );
  color:white;
  padding:25px;
  border-radius:18px;
  box-shadow:
  0 8px 20px rgba(0,0,0,0.08);
  ">

    <div style="
    font-size:14px;
    opacity:.9;
    ">
      👥 Usuarios
    </div>

    <div style="
    font-size:38px;
    font-weight:bold;
    margin-top:10px;
    ">
      ${totalUsers}
    </div>

  </div>

  <div style="
  background:linear-gradient(
  135deg,
  #0B2137,
  #16324F
  );
  color:white;
  padding:25px;
  border-radius:18px;
  box-shadow:
  0 8px 20px rgba(0,0,0,0.08);
  ">

    <div style="
    font-size:14px;
    opacity:.9;
    ">
      📚 Quizzes
    </div>

    <div style="
    font-size:38px;
    font-weight:bold;
    margin-top:10px;
    ">
      ${totalQuizzes}
    </div>

  </div>

  <div style="
  background:linear-gradient(
  135deg,
  #28a745,
  #43c463
  );
  color:white;
  padding:25px;
  border-radius:18px;
  box-shadow:
  0 8px 20px rgba(0,0,0,0.08);
  ">

    <div style="
    font-size:14px;
    opacity:.9;
    ">
      📈 Promedio Global
    </div>

    <div style="
    font-size:38px;
    font-weight:bold;
    margin-top:10px;
    ">
      ${globalAverage}%
    </div>

  </div>

  <div style="
  background:linear-gradient(
  135deg,
  #F5C242,
  #f3b300
  );
  color:#0B2137;
  padding:25px;
  border-radius:18px;
  box-shadow:
  0 8px 20px rgba(0,0,0,0.08);
  ">

    <div style="
    font-size:14px;
    opacity:.9;
    ">
      🔥 Intentos Totales
    </div>

    <div style="
    font-size:38px;
    font-weight:bold;
    margin-top:10px;
    ">
      ${totalAttempts}
    </div>

  </div>

</div>

`;
  users.forEach(user => {

    // BUSCAR DATOS DEL USUARIO

    const userScores =
scores.find(s =>
  s.id === user.id
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
