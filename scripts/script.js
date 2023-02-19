let qrCode = null;
let buffer = '';
const qrCodeElement = document.getElementById('qr-code');
const copyAndShare = document.getElementById('copyshare');
const qrCaption = document.getElementById('qr-caption');


function getEeZeeLink() {
  const apiKey = 'BITLY_ACCESS_TOKEN_HERE'; // Get your API key from Bitly
  const longUrl = document.getElementById('url-input').value.trim();
  const url = `https://api-ssl.bitly.com/v4/shorten`;

  clearQRCode();

  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      long_url: longUrl
    })
  })
    .then(response => response.json())
    .then(data => {
      const shortenedUrl = data.link;
      if (shortenedUrl) {
        buffer = shortenedUrl;
        document.getElementById('shortened-url').innerHTML = `<strong class="app-col-default">Your eeZee link is </strong><a href="${shortenedUrl}">${shortenedUrl}</a>`;

        if (qrCodeElement.hasChildNodes()) {
          qrCodeElement.removeChild(qrCodeElement.firstChild);
        }
        qrCode = new QRCode(qrCodeElement, {
          text: shortenedUrl,
          width: 256,
          height: 256,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
        qrCodeElement.style.display = 'block';
        copyAndShare.style.display = 'block';
        qrCaption.style.display = 'block';

      }
      else {
        alert("Enter or paste a valid URL");
        clearUrl();
      }
    })
    .catch(error => console.error(error));
}

function clearUrl() {
  clearQRCode();
  document.getElementById('url-input').value = '';
  document.getElementById('shortened-url').innerHTML = '';
  buffer = '';
}

function clearQRCode() {
  
  qrCodeElement.style.display = 'none';
  copyAndShare.style.display = 'none';
  qrCaption.style.display = 'none';
  if (qrCodeElement.hasChildNodes()) {
    qrCodeElement.removeChild(qrCodeElement.firstChild);
  }
}

function copyToClipboard() {

  navigator.clipboard.writeText(buffer)
    .then(() => alert('Copied to clipboard'))
    .catch((error) => console.error('Error copying to clipboard', error));
}

function shareLink() {

  const text = buffer; // Text to share

  if (navigator.share) { // Check if Web Share API is supported
    navigator.share({
      title: document.title, // Optional title for the shared content
      text: text // Text to share
    })
      .then(() => console.log('Text shared successfully.'))
      .catch(error => console.error('Error sharing text:', error));
  } else {
    console.error('Web Share API not supported.');
  }
}











