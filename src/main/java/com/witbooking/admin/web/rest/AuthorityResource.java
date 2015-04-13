package com.witbooking.admin.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.witbooking.admin.domain.Authority;
import com.witbooking.admin.repository.AuthorityRepository;
import com.witbooking.admin.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * REST controller for managing Authority.
 */
@RestController
@RequestMapping("/api")
public class AuthorityResource {

    private final Logger log = LoggerFactory.getLogger(AuthorityResource.class);

    @Inject
    private AuthorityRepository authorityRepository;

    /**
     * POST  /authoritys -> Create a new authority.
     */
    @RequestMapping(value = "/authoritys",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> create(@Valid @RequestBody Authority authority) throws URISyntaxException {
        log.debug("REST request to save Authority : {}", authority);
        if (authority.getName() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new authority cannot already have an name").build();
        }
        authorityRepository.save(authority);
        return ResponseEntity.created(new URI("/api/authoritys/" + authority.getName())).build();
    }

    /**
     * PUT  /authoritys -> Updates an existing authority.
     */
    @RequestMapping(value = "/authoritys",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> update(@Valid @RequestBody Authority authority) throws URISyntaxException {
        log.debug("REST request to update Authority : {}", authority);
        if (authority.getName() == null) {
            return create(authority);
        }
        authorityRepository.save(authority);
        return ResponseEntity.ok().build();
    }

    /**
     * GET  /authoritys -> get all the authoritys.
     */
    @RequestMapping(value = "/authoritys",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Authority>> getAll(@RequestParam(value = "page" , required = false) Integer offset,
                                  @RequestParam(value = "per_page", required = false) Integer limit)
        throws URISyntaxException {
        Page<Authority> page = authorityRepository.findAll(PaginationUtil.generatePageRequest(offset, limit));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/authoritys", offset, limit);
        return new ResponseEntity<List<Authority>>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /authoritys/:name -> get the "name" authority.
     */
    @RequestMapping(value = "/authoritys/{name}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Authority> get(@PathVariable String name, HttpServletResponse response) {
        log.debug("REST request to get Authority : {}", name);
        Authority authority = authorityRepository.findOneWithEagerRelationships(name);
        if (authority == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(authority, HttpStatus.OK);
    }

    /**
     * DELETE  /authoritys/:name -> delete the "name" authority.
     */
    @RequestMapping(value = "/authoritys/{name}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public void delete(@PathVariable String name) {
        log.debug("REST request to delete Authority : {}", name);
        authorityRepository.delete(name);
    }
}
