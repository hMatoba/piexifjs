# !/bin/sh -x
if [ "$TRAVIS_BRANCH" == "release*" ]; then
  git config --local user.name "${GITHUB_USERNAME}"
  git config --local user.email "${GITHUB_MYMAIL}"
  echo "${TRAVIS_COMMIT_MESSAGE}"
  git tag "${TRAVIS_COMMIT_MESSAGE}"
fi