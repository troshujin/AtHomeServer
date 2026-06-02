<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="#">MyApp</RouterLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link active" aria-current="page" to="#">Home</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="#">Features</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="#">Pricing</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link disabled" to="#" tabindex="-1" aria-disabled="true">Disabled</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">

</script>
