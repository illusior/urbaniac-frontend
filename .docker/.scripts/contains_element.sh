contains_element() {
    local element
    for element in "${@:2}"; do
        if [[ "$element" == "$1" ]]; then
            return 0
        fi
    done
    return 1
}
