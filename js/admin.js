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
  const activeToday =
users.filter(user => {

const last =
user.lastLogin
? new Date(user.lastLogin)
: null;

if(!last) return false;

const diff =
(new Date() - last)
/
(1000*60*60*24);

return diff <= 1;

}).length;

const activeWeek =
users.filter(user => {

const last =
user.lastLogin
? new Date(user.lastLogin)
: null;

if(!last) return false;

const diff =
(new Date() - last)
/
(1000*60*60*24);

return diff <= 7;

}).length;

const inactiveUsers =
users.length - activeWeek;

const bestUser =
ranking[0];

const hardestModule =
"Visión Binocular";
const branchStats = {};

users.forEach(user => {

  const branch =
  user.branch || "Sin sucursal";

  const userScores =
  scores.find(
    s => s.id === user.id
  );

  const avg =
  userScores?.stats
  ?.overallAverage || 0;

  if(!branchStats[branch]){

    branchStats[branch] = {
      total:0,
      count:0
    };

  }

  branchStats[branch]
  .total += avg;

  branchStats[branch]
  .count++;

});

const branchHTML =
Object.entries(branchStats)
.map(([branch,data],index) => {

  const avg =
  Math.round(
    data.total / data.count
  );

  const colors = [

    ["#00B9D6","#14A9C4"],
    ["#28a745","#43c463"],
    ["#f3b300","#ffcb3d"],
    ["#6f42c1","#8a63d2"],
    ["#dc3545","#ff6b81"]

  ];

  const color =
  colors[
    index % colors.length
  ];

  return `

  <div style="
  margin-top:22px;
  ">

    <div style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:10px;
    flex-wrap:wrap;
    gap:10px;
    ">

      <div style="
      display:flex;
      align-items:center;
      gap:10px;
      ">

        <div style="
        width:14px;
        height:14px;
        border-radius:50%;
        background:
        linear-gradient(
        135deg,
        ${color[0]},
        ${color[1]}
        );
        box-shadow:
        0 0 12px ${color[0]};
        ">
        </div>

        <strong style="
        color:#0B2137;
        font-size:15px;
        ">
          ${branch}
        </strong>

      </div>

      <div style="
      font-weight:bold;
      font-size:16px;
      color:${color[0]};
      ">
        ${avg}%
      </div>

    </div>

    <div style="
    width:100%;
    height:18px;
    background:#edf1f5;
    border-radius:999px;
    overflow:hidden;
    position:relative;
    ">

      <div style="
      width:${avg}%;
      height:100%;
      background:
      linear-gradient(
      90deg,
      ${color[0]},
      ${color[1]}
      );
      border-radius:999px;
      box-shadow:
      0 0 15px ${color[0]};
      transition:1s;
      position:relative;
      overflow:hidden;
      ">

        <div style="
        position:absolute;
        top:0;
        left:-40px;
        width:40px;
        height:100%;
        background:
        rgba(255,255,255,.35);
        filter:blur(4px);
        animation:
        shimmer 2s infinite;
        ">
        </div>

      </div>

    </div>

  </div>

  `;

}).join("");

  // =========================
  // STATS GLOBALES
  // =========================

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

  // =========================
  // RANKING
  // =========================

  const ranking = users.map(user => {

  const userScores =
  scores.find(
    s => s.id === user.id
  );

  const avg =
  userScores?.stats
  ?.overallAverage || 0;

  return {

    name:
    user.name ||
    user.email,

    branch:
    user.branch ||
    "Sin sucursal",

    avg

  };

})
.sort((a,b)=>b.avg-a.avg)
.slice(0,5);

  // =========================
  // RANKING HTML
  // =========================

  html += `

<div style="
display:grid;
grid-template-columns:
repeat(auto-fit,minmax(220px,1fr));
gap:18px;
margin-bottom:30px;
">

<div style="
background:linear-gradient(
135deg,
#00B9D6,
#14A9C4
);
padding:22px;
border-radius:22px;
color:white;
box-shadow:
0 10px 25px rgba(0,185,214,.25);
position:relative;
overflow:hidden;
">

<div style="
font-size:14px;
opacity:.9;
">
📈 Promedio Global
</div>

<div style="
margin-top:10px;
font-size:42px;
font-weight:bold;
">
${globalAverage}%
</div>

<div style="
margin-top:8px;
font-size:13px;
opacity:.85;
">
Rendimiento general
</div>

</div>

<div style="
background:linear-gradient(
135deg,
#28a745,
#43c463
);
padding:22px;
border-radius:22px;
color:white;
box-shadow:
0 10px 25px rgba(40,167,69,.25);
">

<div style="
font-size:14px;
opacity:.9;
">
🟢 Activos hoy
</div>

<div style="
margin-top:10px;
font-size:42px;
font-weight:bold;
">
${activeToday}
</div>

<div style="
margin-top:8px;
font-size:13px;
opacity:.85;
">
Usuarios conectados
</div>

</div>

<div style="
background:linear-gradient(
135deg,
#0B2137,
#1f3b57
);
padding:22px;
border-radius:22px;
color:white;
box-shadow:
0 10px 25px rgba(11,33,55,.25);
">

<div style="
font-size:14px;
opacity:.9;
">
🏆 Mejor promedio
</div>

<div style="
margin-top:10px;
font-size:26px;
font-weight:bold;
word-break:break-word;
">
${bestUser?.email || "N/A"}
</div>

<div style="
margin-top:8px;
font-size:18px;
opacity:.9;
">
${bestUser?.avg || 0}%
</div>

</div>

<div style="
background:linear-gradient(
135deg,
#f3b300,
#ffcb3d
);
padding:22px;
border-radius:22px;
color:white;
box-shadow:
0 10px 25px rgba(243,179,0,.25);
">

<div style="
font-size:14px;
opacity:.9;
">
⚠️ Módulo difícil
</div>

<div style="
margin-top:10px;
font-size:24px;
font-weight:bold;
">
${hardestModule}
</div>

<div style="
margin-top:8px;
font-size:13px;
opacity:.9;
">
Requiere seguimiento
</div>

</div>

</div>

`;
html += `

<div style="
background:white;
padding:25px;
border-radius:22px;
margin-bottom:30px;
box-shadow:
0 8px 20px rgba(0,0,0,.06);
">

<h2 style="
margin-bottom:20px;
color:#0B2137;
">
📊 Rendimiento por sucursal
</h2>

${branchHTML}

</div>

`;
 html += `

<div style="
margin-bottom:30px;
background:white;
padding:28px;
border-radius:24px;
box-shadow:
0 10px 30px rgba(0,0,0,.06);
">

<h2 style="
margin-bottom:25px;
color:#0B2137;
font-size:28px;
">
🏆 Leaderboard CV+
</h2>

<div style="
display:flex;
flex-direction:column;
gap:18px;
">

${ranking.map((user,index)=>{

const medal =
index===0
? "🥇"
: index===1
? "🥈"
: index===2
? "🥉"
: "🏅";

const bg =
index===0
? "linear-gradient(135deg,#FFD700,#ffcc00)"
: index===1
? "linear-gradient(135deg,#d9d9d9,#bfbfbf)"
: index===2
? "linear-gradient(135deg,#CD7F32,#d99552)"
: "linear-gradient(135deg,#00B9D6,#14A9C4)";

return `

<div style="
background:${bg};
padding:22px;
border-radius:22px;
color:white;
position:relative;
overflow:hidden;
box-shadow:
0 8px 20px rgba(0,0,0,.12);
transition:.3s;
">

<div style="
display:flex;
justify-content:space-between;
align-items:center;
gap:20px;
flex-wrap:wrap;
">

<div>

<div style="
font-size:36px;
">
${medal}
</div>

<div style="
margin-top:8px;
font-size:22px;
font-weight:bold;
">
${user.name}
</div>

<div style="
margin-top:6px;
font-size:14px;
opacity:.9;
">
🏢 ${user.branch}
</div>

</div>

<div style="
text-align:right;
">

<div style="
font-size:46px;
font-weight:bold;
line-height:1;
">
${user.avg}%
</div>

<div style="
margin-top:8px;
font-size:14px;
opacity:.9;
">
Promedio General
</div>

</div>

</div>

<div style="
margin-top:18px;
width:100%;
height:14px;
background:rgba(255,255,255,.25);
border-radius:999px;
overflow:hidden;
">

<div style="
width:${user.avg}%;
height:100%;
background:white;
border-radius:999px;
box-shadow:
0 0 15px rgba(255,255,255,.5);
">
</div>

</div>

</div>

`;

}).join("")}

</div>

</div>

`;

  // =========================
  // TARJETAS GLOBALES
  // =========================

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
  html += `

<div style="
display:grid;
grid-template-columns:
repeat(auto-fit,minmax(320px,1fr));
gap:25px;
margin-bottom:30px;
">

<div style="
background:white;
padding:30px;
border-radius:28px;
box-shadow:
0 10px 30px rgba(0,0,0,.06);
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
position:relative;
overflow:hidden;
">

<h2 style="
margin-bottom:25px;
color:#0B2137;
font-size:24px;
">
📈 Promedio Global
</h2>

<div style="
position:relative;
width:220px;
height:220px;
display:flex;
align-items:center;
justify-content:center;
">

<svg
width="220"
height="220"
style="
transform:rotate(-90deg);
">

<circle
cx="110"
cy="110"
r="88"
stroke="#edf1f5"
stroke-width="18"
fill="none"
/>

<circle
cx="110"
cy="110"
r="88"
stroke="url(#gradient)"
stroke-width="18"
fill="none"
stroke-linecap="round"
stroke-dasharray="${2 * Math.PI * 88}"
stroke-dashoffset="${
2 * Math.PI * 88 *
(1 - globalAverage/100)
}"
style="
transition:1s;
filter:
drop-shadow(
0 0 10px
rgba(0,185,214,.4)
);
"
/>

<defs>

<linearGradient
id="gradient"
x1="0%"
y1="0%"
x2="100%"
y2="100%"
>

<stop
offset="0%"
stop-color="#00B9D6"
/>

<stop
offset="100%"
stop-color="#14A9C4"
/>

</linearGradient>

</defs>

</svg>

<div style="
position:absolute;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
">

<div style="
font-size:52px;
font-weight:bold;
color:#0B2137;
line-height:1;
">
${globalAverage}%
</div>

<div style="
margin-top:8px;
font-size:14px;
color:#777;
">
Rendimiento Global
</div>

</div>

</div>

<div style="
margin-top:20px;
padding:10px 18px;
border-radius:999px;
background:
linear-gradient(
135deg,
#00B9D6,
#14A9C4
);
color:white;
font-weight:bold;
font-size:14px;
box-shadow:
0 6px 18px rgba(0,185,214,.25);
">

🔥 Excelente desempeño

</div>

</div>

`;

  // =========================
  // USERS
  // =========================

  users.forEach(user => {
    const lastLoginDate =
user.lastLogin
? new Date(user.lastLogin)
: null;

const now = new Date();

const diffMs =
lastLoginDate
? now - lastLoginDate
: Infinity;

const diffDays =
Math.floor(
diffMs / (1000 * 60 * 60 * 24)
);

let activityStatus = "";
let activityColor = "";
let activityBg = "";
let activityText = "";

if(diffDays <= 1){

  activityStatus = "🟢 Activo hoy";
  activityColor = "#28a745";
  activityBg = "#eaf7ee";
  activityText =
  "Última actividad reciente";

}
else if(diffDays <= 7){

  activityStatus =
  "🟡 Activo esta semana";

  activityColor = "#f3b300";
  activityBg = "#fff8e1";

  activityText =
  `Hace ${diffDays} días`;

}
else{

  activityStatus = "🔴 Inactivo";
  activityColor = "#dc3545";
  activityBg = "#fdecec";

  activityText =
  `Hace ${diffDays} días`;

}

    const userScores =
    scores.find(s =>
      s.id === user.id
    );

    const stats =
    userScores?.stats || {};

    const avg =
    stats.overallAverage || 0;

    const totalAttempts =
    stats.totalAttempts || 0;

    const totalQuizzes =
    stats.totalQuizzes || 0;

    // =========================
    // PROGRESO
    // =========================

    const completedModules =
    Object.keys(
      userScores?.scores || {}
    ).filter(key =>
      typeof userScores.scores[key]
      === "object"
    ).length;

    const totalModules = 18;

    const progressPercent =
    Math.round(
      (completedModules / totalModules)
      * 100
    );

    // =========================
    // HISTORIAL
    // =========================

let historyHTML = "";

if(
  userScores &&
  userScores.scores
){

  Object.entries(
    userScores.scores
  ).forEach(([quiz, value]) => {

    if(
      typeof value === "object"
    ){

      const avg =
      value.average || 0;

      const lastScore =
      value.lastScore || 0;

      const attempts =
      value.attempts || 0;

      let status = "";
      let color = "";
      let bg = "";

      if(avg >= 80){

        status = "Excelente";
        color = "#28a745";
        bg = "#eaf7ee";

      } else if(avg >= 60){

        status = "Regular";
        color = "#f3b300";
        bg = "#fff8e1";

      } else {

        status = "Necesita refuerzo";
        color = "#dc3545";
        bg = "#fdecec";

      }

      historyHTML += `

      <div style="
      margin-top:15px;
      padding:18px;
      border-radius:16px;
      background:${bg};
      border-left:6px solid ${color};
      transition:.3s;
      ">

        <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        flex-wrap:wrap;
        gap:10px;
        ">

          <div>

            <div style="
            font-size:18px;
            font-weight:bold;
            color:#0B2137;
            ">
          📘 ${
(
window.MODULES || []
).find(
m => String(m.id)
=== String(quiz)
)?.title || `Quiz ${quiz}`
}
            </div>

            <div style="
            margin-top:6px;
            font-size:13px;
            color:${color};
            font-weight:bold;
            ">
              ${status}
            </div>

          </div>

          <div style="
          font-size:26px;
          font-weight:bold;
          color:${color};
          ">
            ${avg}%
          </div>

        </div>

        <div style="
        margin-top:15px;
        display:grid;
        grid-template-columns:
        repeat(auto-fit,minmax(120px,1fr));
        gap:12px;
        ">

          <div>
            <div style="
            font-size:12px;
            color:#666;
            ">
              🎯 Última nota
            </div>

            <div style="
            margin-top:4px;
            font-weight:bold;
            ">
              ${lastScore}%
            </div>
          </div>

          <div>
            <div style="
            font-size:12px;
            color:#666;
            ">
              🔄 Intentos
            </div>

            <div style="
            margin-top:4px;
            font-weight:bold;
            ">
              ${attempts}
            </div>
          </div>

        </div>

        <div style="
        margin-top:15px;
        width:100%;
        height:12px;
        background:white;
        border-radius:999px;
        overflow:hidden;
        ">

          <div style="
          width:${avg}%;
          height:100%;
          background:${color};
          border-radius:999px;
          transition:.4s;
          ">
          </div>

        </div>

      </div>

      `;

    }

  });

    }

    // =========================
    // CARD
    // =========================

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
        ${user.name || "Sin nombre"}
      </h3>

      <p style="
      color:#666;
      font-size:14px;
      ">
        Último Login:
        ${user.lastLogin || "No disponible"}
      </p>
      <div style="
margin-top:12px;
display:inline-flex;
align-items:center;
gap:10px;
padding:10px 14px;
border-radius:999px;
background:${activityBg};
color:${activityColor};
font-weight:bold;
font-size:13px;
box-shadow:
0 2px 8px rgba(0,0,0,0.05);
">

<div style="
width:10px;
height:10px;
border-radius:50%;
background:${activityColor};
box-shadow:
0 0 10px ${activityColor};
animation:pulse 1.5s infinite;
">
</div>

<div>
${activityStatus}
</div>

</div>

<div style="
margin-top:6px;
font-size:13px;
color:#777;
">
${activityText}
</div>
      <p style="
margin-top:6px;
font-size:14px;
color:#555;
">

🏢 ${user.branch || "Sin sucursal"}

</p>

<p style="
margin-top:4px;
font-size:14px;
color:#555;
">

💼 ${user.position || "Sin cargo"}

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

      <!-- PROGRESO -->

      <div style="
      margin-top:20px;
      ">

        <div style="
        display:flex;
        justify-content:space-between;
        margin-bottom:8px;
        ">

          <strong>
            📚 Progreso
          </strong>

          <span style="
          font-size:13px;
          color:#666;
          ">
            ${completedModules}/${totalModules}
          </span>

        </div>

        <div style="
        width:100%;
        height:12px;
        background:#edf1f5;
        border-radius:999px;
        overflow:hidden;
        ">

          <div style="
          width:${progressPercent}%;
          height:100%;
          background:linear-gradient(
            90deg,
            #00B9D6,
            #14A9C4
          );
          border-radius:999px;
          ">
          </div>

        </div>

        <div style="
        margin-top:6px;
        font-size:12px;
        color:#777;
        ">
          ${progressPercent}% completado
        </div>

      </div>

      <!-- HISTORIAL -->

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
