$css = @"
.phone-mockup {
  width: 320px;
  margin: 0 auto;
  position: relative;
}
.mockup-frame {
  width: 100%;
  height: auto;
  display: block;
  position: relative;
  z-index: 3;
  pointer-events: none;
}
.phone-screen {
  position: absolute;
  top: 12px;
  left: 24px;
  width: 272px;
  height: 576px;
  background: #63a8ed;
  border-radius: 26px;
  overflow: hidden;
  z-index: 2;
  padding: 20px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.memo-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  font-family: inherit;
  text-align: left;
}
.memo-1 { background: #ffebfe; }
.memo-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}
.memo-tags .tag {
  font-size: 10px;
  font-weight: 600;
  color: #63a8ed;
  background: rgba(99, 168, 237, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}
.memo-title {
  font-size: 13px;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
}
.memo-text {
  font-size: 11px;
  color: #666;
  line-height: 1.4;
}
"@
Set-Content -Path style.css -Value (Get-Content style.css | Where-Object {$_ -notmatch ".screen-wrapper|.html-card|.card-tags|.card-title|.card-text|.card-[1-4]"})
Add-Content -Path style.css -Value $css
