const jsonFiles = [
  'hackerone_data.json',
  'bugcrowd_data.json',
  'intigriti_data.json',
  'yeswehack_data.json',
];

let allPrograms = [];

Promise.all(
  jsonFiles.map(file =>
    fetch(file)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load ${file}`);
        return res.json();
      })
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
    const scopeUrls = (program.targets?.in_scope || [])
      .map(t => t.asset_identifier)
      .join('<br>');

    const pays = program.offers_bounties ? 'Yes' : 'No';

    const html = `
      <div class="program">
        <h3>${program.name}</h3>
        <p><strong>Platform:</strong> ${program.handle || 'N/A'}</p>
        <p><strong>Offers Bounty:</strong> ${pays}</p>
        <p><strong>In-Scope Targets (Domains/URLs):</strong><br>${scopeUrls || 'None listed'}</p>
        ${program.website ? `<p><strong>Website:</strong> <a href="${program.website}" target="_blank">${program.website}</a></p>` : ''}
      </div>
    `;
    resultsDiv.insertAdjacentHTML('beforeend', html);
  });
}
