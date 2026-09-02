$css = @"
.phone-mockup {
  width: 320px;
  height: 650px;
  margin: 0 auto;
  position: relative;
  background: #ffffff;
  border-radius: 40px;
  border: 4px solid #e2e2e2;
  box-shadow: 0 24px 48px rgba(0,0,0,0.1);
  overflow: hidden;
}
.phone-screen {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  background: #63a8ed;
  border-radius: 28px;
  overflow: hidden;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
"@
Set-Content -Path style.css -Value (Get-Content style.css | Where-Object {$_ -notmatch ".phone-mockup {|.mockup-frame {|.phone-screen {"})
Add-Content -Path style.css -Value $css
