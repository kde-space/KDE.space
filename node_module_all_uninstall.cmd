@Echo off

echo //////////////////////////////////////////////////////////////////
echo %cd%\node_modules\*をまとめてアンインストールするよ。
echo //////////////////////////////////////////////////////////////////

pause

for /d %%i in (%cd%\node_modules\*) do (
echo %%~ni
npm un %%~ni
)

pause