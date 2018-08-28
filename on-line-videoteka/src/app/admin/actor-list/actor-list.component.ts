import { Component, OnInit, OnDestroy } from '@angular/core';
import { Actor } from '../../models/actor.model';
import { PageEvent } from '../../../../node_modules/@angular/material';
import { ActorService } from '../../services/actors.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { Router } from '../../../../node_modules/@angular/router';

Date.prototype.toString = function() {
  const parts = this.toLocaleString()
  .split(',')
  .join('')
  .split('/');
  let date = [parts[1], parts[0] , parts[2].split(' ')[0]].join('.');
  if ( date === '1.1.1970') {
    date = 'N/A';
  }
  return date;
};

@Component({
  selector: 'app-actor-list',
  templateUrl: './actor-list.component.html',
  styleUrls: ['./actor-list.component.css']
})
export class ActorListComponent implements OnInit, OnDestroy {
  textSearch = '';
  actors = [];
  isLoading = true;
  totalActors = 0;
  actorsPerPage = 5;
  pageSizeOptions = [ 5, 10, 20, 30];
  currentPage = 1;

  private actorSub: Subscription;

  constructor( private actorsService: ActorService, private router: Router ) { }
  displayedColumns = ['firstName', 'lastName', 'born', 'died', 'actions'];
  ngOnInit() {
    this.actorSub = this.actorsService.getActorUpdateListener().subscribe(
      (actorData: {actors: Actor[], actorCount: number }) => {
        this.isLoading = false;
        this.totalActors = actorData.actorCount;
        this.actors = actorData.actors;
      }
    );
    this.actorsService.getActors(this.actorsPerPage, this.currentPage, this.textSearch);
  }

  onEdit(element) {
    this.router.navigate(['admin/actoradd', element.id]);
  }

  onDelete(element) {
    this.actorsService.deleteActor(element.id).subscribe((response) => {
      this.actorsService.getActors(this.actorsPerPage, this.currentPage, this.textSearch);
    });
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.actorsPerPage = pageData.pageSize;
    this.actorsService.getActors(this.actorsPerPage, this.currentPage, this.textSearch);
  }

  onSearch(searchInput) {
    this.textSearch = searchInput.value;
    this.actorsService.getActors(this.actorsPerPage, this.currentPage, this.textSearch);
  }

  goToActorAdd() {
    this.router.navigate(['admin/actoradd']);
  }

  ngOnDestroy() {
    this.actorSub.unsubscribe();
  }
}
