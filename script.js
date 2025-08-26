const sources = [
  {
    name: "HackerOne",
    url: "https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/main/data/hackerone_data.json"
  },
  {
    name: "Bugcrowd",
    url: "https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/main/data/bugcrowd_data.json"
  },
  {
    name: "Intigriti",
    url: "https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/main/data/intigriti_data.json"
  },
  {
    name: "YesWeHack",
    url: "https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/main/data/yeswehack_data.json"
  }
];

let allPrograms = [];

Promise.all(
  sources.map(source =>
    fetch(source.url)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load ${source.url}`);
        return res.json();
      })
      .then(data => data.map(prog => ({...prog, _source: source.name})))
      .catch(e => {
        console.warn(e);
        return [];
      })
  )
).then(dataArrays => {
  allPrograms = dataArrays.flat();
  document.getElementById('searchInput').addEventListener('input', searchPrograms);
});

function searchPrograms() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!searchTerm) {
    resultsDiv.innerHTML = '<p>Type to search for a program...</p>';
    return;
  }

  const matches = allPrograms.filter(p =>
    p.name && p.name.toLowerCase().includes(searchTerm)
  );

  if (matches.length === 0) {
    resultsDiv.innerHTML = '<p>No matching programs found.</p>';
    return;
  }

  matches.forEach(program => {
    // Get all in-scope URLs/domains
    let scopeUrls = [];
    if (program.targets && Array.isArray(program.targets.in_scope)) {
      scopeUrls = program.targets.in_scope
        .map(t => t.asset_identifier)
        .filter(Boolean);
    }
    const pays = program.offers_bounties ? 'Yes' : 'No';

    const html = `
      <div class="program">
        <h3>${program.name}</h3>
        <p><strong>Source:</strong> ${program._source}</p>
        <p><strong>Offers Bounty:</strong> ${pays}</p>
        <p><strong>In-Scope Targets (Domains/URLs):</strong><br>${scopeUrls.length > 0 ? scopeUrls.join('<br>') : 'None listed'}</p>
        ${program.website ? `<p><strong>Website:</strong> <a href="${program.website}" target="_blank">${program.website}</a></p>` : ''}
      </div>
    `;
    resultsDiv.insertAdjacentHTML('beforeend', html);
  });
}
