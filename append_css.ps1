$css = @"
.screen-wrapper {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.html-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  font-family: inherit;
  text-align: left;
}
.card-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}
.card-tags .tag {
  font-size: 10px;
  font-weight: 600;
  color: #63a8ed;
  background: rgba(99, 168, 237, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}
.card-title {
  font-size: 13px;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
}
.card-text {
  font-size: 11px;
  color: #666;
  line-height: 1.4;
}
"@
Add-Content -Path style.css -Value $css
