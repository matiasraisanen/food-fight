import React, { Component } from "react";
var year = new Date().getFullYear();

class Footer extends Component {
  render() {
    return (
      <div>
        <footer className="footer">
          <div>
            <a className="text-muted" href="https://github.com/matiasraisanen/solidabis-koodihaaste-2022">Matias Räisänen 2022</a>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;

