<template>
  <nav class="hidden lg:block p-4 absolute left-0 top-0">
    <div class="-my-1">
      <div class="top-0 absolute left-0 p-4">
        <a
          href="https://twitter.com/intent/tweet?text=Check%20out%20Bioicons!%20%F0%9F%94%A5%0A%0Aby%20@simonduerr%20"
          target="_blank"
          rel="noopener noreferrer"
          class="gh-button gh-button-tweet"
          ><span></span>Tweet about bioicons</a
        ><br />
        <a
          href="//github.com/duerrsimon/bioicons"
          target="_blank"
          rel="noopener noreferrer"
          class="gh-button gh-button-gh"
          ><span></span>Star on Github</a
        >
      </div>
    </div>
  </nav>
</template>

<style>
.gh-button {
  display: inline-block;
}
.gh-button {
  box-sizing: border-box;
  height: 30px;
  font-weight: bold;
  font-size: 11px;
  line-height: 14px;
  padding: 2px 5px 2px 4px;
  color: #333;
  text-decoration: none;
  text-shadow: 0 1px 0 #fff;
  white-space: nowrap;
  cursor: pointer;
  overflow: hidden;
  border-radius: 3px;

  padding: 3px 10px 3px 8px;
  font-size: 16px;
  line-height: 22px;
  border-radius: 4px;
  background-color: #eee;
  background-image: linear-gradient(#fcfcfc, #eee);
  border: 1px solid #d5d5d5;
}

.gh-button:hover,
.gh-button:focus {
  text-decoration: none;
  background-color: #ddd;
  background-image: linear-gradient(#eee, #ddd);
  border-color: #ccc;
}

.gh-button:active {
  background: #dcdcdc;
  border-color: #b5b5b5;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}

.gh-button-gh span {
  display: inline-block;
  vertical-align: top;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIxMiAxMiA0MCA0MCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAxMiAxMiA0MCA0MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBmaWxsPSIjMzMzMzMzIiBkPSJNMzIsMTMuNGMtMTAuNSwwLTE5LDguNS0xOSwxOWMwLDguNCw1LjUsMTUuNSwxMywxOGMxLDAuMiwxLjMtMC40LDEuMy0wLjljMC0wLjUsMC0xLjcsMC0zLjINCgljLTUuMywxLjEtNi40LTIuNi02LjQtMi42QzIwLDQxLjYsMTguOCw0MSwxOC44LDQxYy0xLjctMS4yLDAuMS0xLjEsMC4xLTEuMWMxLjksMC4xLDIuOSwyLDIuOSwyYzEuNywyLjksNC41LDIuMSw1LjUsMS42DQoJYzAuMi0xLjIsMC43LTIuMSwxLjItMi42Yy00LjItMC41LTguNy0yLjEtOC43LTkuNGMwLTIuMSwwLjctMy43LDItNS4xYy0wLjItMC41LTAuOC0yLjQsMC4yLTVjMCwwLDEuNi0wLjUsNS4yLDINCgljMS41LTAuNCwzLjEtMC43LDQuOC0wLjdjMS42LDAsMy4zLDAuMiw0LjcsMC43YzMuNi0yLjQsNS4yLTIsNS4yLTJjMSwyLjYsMC40LDQuNiwwLjIsNWMxLjIsMS4zLDIsMywyLDUuMWMwLDcuMy00LjUsOC45LTguNyw5LjQNCgljMC43LDAuNiwxLjMsMS43LDEuMywzLjVjMCwyLjYsMCw0LjYsMCw1LjJjMCwwLjUsMC40LDEuMSwxLjMsMC45YzcuNS0yLjYsMTMtOS43LDEzLTE4LjFDNTEsMjEuOSw0Mi41LDEzLjQsMzIsMTMuNHoiLz4NCjwvc3ZnPg0K);
  background-size: contain;
}

.gh-button-tweet span {
  display: inline-block;
  vertical-align: top;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDU2LjY5MyA1Ni42OTMiIGhlaWdodD0iNTYuNjkzcHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1Ni42OTMgNTYuNjkzIiB3aWR0aD0iNTYuNjkzcHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0yOC4zNDgsNS4xNTdjLTEzLjYsMC0yNC42MjUsMTEuMDI3LTI0LjYyNSwyNC42MjVjMCwxMy42LDExLjAyNSwyNC42MjMsMjQuNjI1LDI0LjYyM2MxMy42LDAsMjQuNjIzLTExLjAyMywyNC42MjMtMjQuNjIzICBDNTIuOTcxLDE2LjE4NCw0MS45NDcsNS4xNTcsMjguMzQ4LDUuMTU3eiBNNDAuNzUyLDI0LjgxN2MwLjAxMywwLjI2NiwwLjAxOCwwLjUzMywwLjAxOCwwLjgwM2MwLDguMjAxLTYuMjQyLDE3LjY1Ni0xNy42NTYsMTcuNjU2ICBjLTMuNTA0LDAtNi43NjctMS4wMjctOS41MTMtMi43ODdjMC40ODYsMC4wNTcsMC45NzksMC4wODYsMS40OCwwLjA4NmMyLjkwOCwwLDUuNTg0LTAuOTkyLDcuNzA3LTIuNjU2ICBjLTIuNzE1LTAuMDUxLTUuMDA2LTEuODQ2LTUuNzk2LTQuMzExYzAuMzc4LDAuMDc0LDAuNzY3LDAuMTExLDEuMTY3LDAuMTExYzAuNTY2LDAsMS4xMTQtMC4wNzQsMS42MzUtMC4yMTcgIGMtMi44NC0wLjU3LTQuOTc5LTMuMDgtNC45NzktNi4wODRjMC0wLjAyNywwLTAuMDUzLDAuMDAxLTAuMDhjMC44MzYsMC40NjUsMS43OTMsMC43NDQsMi44MTEsMC43NzcgIGMtMS42NjYtMS4xMTUtMi43NjEtMy4wMTItMi43NjEtNS4xNjZjMC0xLjEzNywwLjMwNi0yLjIwNCwwLjg0LTMuMTJjMy4wNjEsMy43NTQsNy42MzQsNi4yMjUsMTIuNzkyLDYuNDgzICBjLTAuMTA2LTAuNDUzLTAuMTYxLTAuOTI4LTAuMTYxLTEuNDE0YzAtMy40MjYsMi43NzgtNi4yMDUsNi4yMDYtNi4yMDVjMS43ODUsMCwzLjM5NywwLjc1NCw0LjUyOSwxLjk1OSAgYzEuNDE0LTAuMjc3LDIuNzQyLTAuNzk1LDMuOTQxLTEuNTA2Yy0wLjQ2NSwxLjQ1LTEuNDQ4LDIuNjY2LTIuNzMsMy40MzNjMS4yNTctMC4xNSwyLjQ1My0wLjQ4NCwzLjU2NS0wLjk3NyAgQzQzLjAxOCwyMi44NDksNDEuOTY1LDIzLjk0Miw0MC43NTIsMjQuODE3eiIvPjwvc3ZnPg==);
  background-size: contain;
  color: blue;
}
</style>
