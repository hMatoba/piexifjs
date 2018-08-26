# !/bin/sh -x
if [ "$TRAVIS_BRANCH" == "release*" ]; then
  git config --local user.name "${GITHUB_USERNAME}"
  git config --local user.email "${GITHUB_MYMAIL}"
  git tag "$(date +'%Y%m%d%H%M%S')-$(git log --format=%h -1)"
fi