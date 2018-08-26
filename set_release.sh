# !/bin/sh -x
if [ "$TRAVIS_BRANCH" == "release*" ]; then
  git config --local user.name "${GITHUB_USERNAME}"
  git config --local user.email "${GITHUB_MYMAIL}"
  git tag "$(git log --format=%s -1)"
fi